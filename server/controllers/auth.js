import crypto from 'crypto';
import { encrypt, verify } from '../utils/bcrypt.js';
import Auth from '../models/auth.js';
import Session from "../models/session.js";
import { generateAccessToken, generateRefreshToken, verifyRefreshToken } from "../utils/jwt.js";
import localDate from "../utils/localDate.js";
import validatePin from '../utils/validatePin.js';
import { recoverPinEmail } from '../utils/sendEmail.js';
import { checkAccountLockout, incrementFailedAttempts, clearFailedAttempts } from '../utils/accountLockout.js';
import {
  badRequest,
  unauthorized,
  forbidden,
  notFound,
  locked,
} from '../errors/AppError.js';

const generateSessionId = () => {
  // crypto.randomUUID exists on modern Node; fall back for older runtimes.
  if (typeof crypto.randomUUID === "function") return crypto.randomUUID();
  return crypto.randomBytes(16).toString("hex");
};

const authenticateDevice = async (req, res) => {
  const { pin } = req.body;
  const auth = (await Auth.find())[0];
  if (!auth) {
    throw notFound("No Auth");
  }

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

    await Session.create({
      userId: auth._id,
      sessionId,
      refreshToken: refreshTokenHash,
    });

    const accessToken = generateAccessToken({ userId: auth._id, sessionId });
    return res.status(200).json({ accessToken, refreshToken, sessionId });
  }
  
  // unverified
  const { shouldLock, attemptsRemaining, lockedUntil } = await incrementFailedAttempts(auth);
  if (shouldLock) {
    const lockMinutes = Math.ceil((lockedUntil - new Date()) / 1000 / 60);
    throw locked(`Too many failed attempts. Account locked for ${lockMinutes} minutes`);
  }

  throw unauthorized(
    `Incorrect PIN. ${attemptsRemaining} attempt(s) remaining before account lockout`
  );
};

const currentlyAuthorized = (_, res) => {
  res.status(200).json(true);
};

const refreshAuth = async (req, res) => {
  const { refreshToken, sessionId } = req.body ?? {};
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

  const session = await Session.findOne({ sessionId });
  if (!session) throw forbidden("Forbidden");

  if (String(session.userId) !== String(decoded.sub)) {
    throw forbidden("Forbidden");
  }

  const matches = await verify(refreshToken, session.refreshToken);
  if (!matches) {
    await Session.deleteOne({ sessionId });
    throw forbidden("Forbidden");
  }

  const newRefreshToken = generateRefreshToken({ userId: session.userId, sessionId });
  const newRefreshHash = await encrypt(newRefreshToken);
  await Session.updateOne({ sessionId }, { $set: { refreshToken: newRefreshHash } });

  const accessToken = generateAccessToken({ userId: session.userId, sessionId });
  return res.status(200).json({ accessToken, refreshToken: newRefreshToken, sessionId });
};

const logout = async (req, res) => {
  const { sessionId } = req.body ?? {};
  if (!sessionId) throw badRequest("sessionId required");
  await Session.deleteOne({ sessionId });
  return res.status(200).json({ ok: true });
};

const recoverPin = async (_, res) => {
  const code = crypto.randomInt(1000000, 9999999).toString();
  const expires = localDate(new Date(new Date().getTime() + 30 * 60 * 1000));
  const auth = (await Auth.find())[0];
  if (!auth) throw notFound("No Auth");

  const encryptedCode = await encrypt(code);
  auth.recovery = { code: encryptedCode, expires };
  await auth.save();

  const emailSent = await recoverPinEmail(code);
  if (!emailSent) {
    throw badRequest("Recovery email could not be sent. Please try again.");
  }

  res.status(200).json({ message: "Email sent for recovery", expires });
};

const changePin = async (req, res) => {
  const { newPin, recoveryCode } = req.body;
  const validPin = validatePin(newPin);
  if (!validPin) throw badRequest("Pin format invalid");

  const auth = (await Auth.find())[0];
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
  await auth.save();
  res.status(200).json({ message: "Pin successfully changed" });
};

export { authenticateDevice, currentlyAuthorized, refreshAuth, logout, recoverPin, changePin };
