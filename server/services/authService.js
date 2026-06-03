import crypto from "crypto";
import { encrypt, verify } from "../utils/bcrypt.js";
import {
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
} from "../utils/jwt.js";
import localDate from "../utils/localDate.js";
import validatePin from "../utils/validatePin.js";
import {
  checkAccountLockout,
  incrementFailedAttempts,
  clearFailedAttempts,
} from "../utils/accountLockout.js";
import {
  badRequest,
  unauthorized,
  forbidden,
  notFound,
  locked,
} from "../errors/AppError.js";

const generateSessionId = () => {
  if (typeof crypto.randomUUID === "function") return crypto.randomUUID();
  return crypto.randomBytes(16).toString("hex");
};

export default class AuthService {
  constructor({ authRepository, sessionRepository, emailService }) {
    this.authRepository = authRepository;
    this.sessionRepository = sessionRepository;
    this.emailService = emailService;
  }

  async authenticateWithPin(pin) {
    const auth = await this.authRepository.getSingleton();
    if (!auth) throw notFound("No Auth");

    const lockStatus = checkAccountLockout(auth);
    if (lockStatus.isLocked) {
      throw locked(
        `Account locked due to too many failed attempts. Try again in ${lockStatus.remainingTime} minute(s)`
      );
    }

    const verified = await verify(pin, auth.pin);
    if (verified) {
      await clearFailedAttempts(auth);
      const sessionId = generateSessionId();
      const refreshToken = generateRefreshToken({ userId: auth._id, sessionId });
      const refreshTokenHash = await encrypt(refreshToken);

      await this.sessionRepository.create({
        userId: auth._id,
        sessionId,
        refreshToken: refreshTokenHash,
      });

      const accessToken = generateAccessToken({ userId: auth._id, sessionId });
      return { accessToken, refreshToken, sessionId };
    }

    const { shouldLock, attemptsRemaining, lockedUntil } =
      await incrementFailedAttempts(auth);
    if (shouldLock) {
      const lockMinutes = Math.ceil((lockedUntil - new Date()) / 1000 / 60);
      throw locked(
        `Too many failed attempts. Account locked for ${lockMinutes} minutes`
      );
    }

    throw unauthorized(
      `Incorrect PIN. ${attemptsRemaining} attempt(s) remaining before account lockout`
    );
  }

  async refreshTokens(refreshToken, sessionId) {
    if (!refreshToken || !sessionId) {
      throw badRequest("refreshToken and sessionId required");
    }

    const verification = verifyRefreshToken(refreshToken);
    if (!verification.ok) {
      throw unauthorized("Unauthorized - refresh token invalid");
    }

    const decoded = verification.decoded;
    if (decoded?.typ !== "refresh" || decoded?.sid !== sessionId) {
      throw unauthorized("Unauthorized - refresh token invalid");
    }

    const session = await this.sessionRepository.findBySessionId(sessionId);
    if (!session) throw forbidden("Forbidden");

    if (String(session.userId) !== String(decoded.sub)) {
      throw forbidden("Forbidden");
    }

    const matches = await verify(refreshToken, session.refreshToken);
    if (!matches) {
      await this.sessionRepository.deleteBySessionId(sessionId);
      throw forbidden("Forbidden");
    }

    const newRefreshToken = generateRefreshToken({
      userId: session.userId,
      sessionId,
    });
    const newRefreshHash = await encrypt(newRefreshToken);
    await this.sessionRepository.updateRefreshHash(sessionId, newRefreshHash);

    const accessToken = generateAccessToken({
      userId: session.userId,
      sessionId,
    });
    return { accessToken, refreshToken: newRefreshToken, sessionId };
  }

  async logout(sessionId) {
    if (!sessionId) throw badRequest("sessionId required");
    await this.sessionRepository.deleteBySessionId(sessionId);
    return { ok: true };
  }

  async startPinRecovery() {
    const code = crypto.randomInt(1000000, 9999999).toString();
    const expires = localDate(new Date(new Date().getTime() + 30 * 60 * 1000));
    const auth = await this.authRepository.getSingleton();
    if (!auth) throw notFound("No Auth");

    const encryptedCode = await encrypt(code);
    auth.recovery = { code: encryptedCode, expires };
    await this.authRepository.save(auth);

    const emailSent = await this.emailService.sendPinRecoveryEmail(code);
    if (!emailSent) {
      throw badRequest("Recovery email could not be sent. Please try again.");
    }

    return { message: "Email sent for recovery", expires };
  }

  async changePin(newPin, recoveryCode) {
    const validPin = validatePin(newPin);
    if (!validPin) throw badRequest("Pin format invalid");

    const auth = await this.authRepository.getSingleton();
    if (!auth?.recovery?.code || !auth?.recovery?.expires) {
      throw notFound("No open recovery");
    }

    const verifiedCode = await verify(recoveryCode, auth.recovery.code);
    if (!verifiedCode) throw unauthorized("Incorrect recovery code");
    if (auth.recovery.expires < localDate(new Date())) {
      throw unauthorized("Recovery code expired");
    }

    auth.pin = await encrypt(newPin);
    auth.recovery = { code: null, expires: null };
    await this.authRepository.save(auth);
    return { message: "Pin successfully changed" };
  }
}
