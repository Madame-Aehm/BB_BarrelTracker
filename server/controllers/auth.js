import crypto from 'crypto';
import { encrypt, verify } from '../utils/bcrypt.js';
import Auth from '../models/auth.js';
import Session from "../models/session.js";
import { generateAccessToken, generateRefreshToken, verifyRefreshToken } from "../utils/jwt.js";
import localDate from "../utils/localDate.js";
import validatePin from '../utils/validatePin.js';
import { recoverPinEmail } from '../utils/sendEmail.js';
import { checkAccountLockout, incrementFailedAttempts, clearFailedAttempts } from '../utils/accountLockout.js';

const generateSessionId = () => {
  // crypto.randomUUID exists on modern Node; fall back for older runtimes.
  if (typeof crypto.randomUUID === "function") return crypto.randomUUID();
  return crypto.randomBytes(16).toString("hex");
};

const authenticateDevice = async(req, res) => {
  const { pin } = req.body;
  try {
    const auth = (await Auth.find())[0];
    if (!auth) {
      return res.status(404).json({ error: "No Auth" });
    }

    // Check if account is locked
    const lockStatus = checkAccountLockout(auth);
    if (lockStatus.isLocked) {
      return res.status(423).json({ 
        error: `Account locked due to too many failed attempts. Try again in ${lockStatus.remainingTime} minute(s)` 
      });
    }

    // Verify PIN
    const verified = await verify(pin, auth.pin);
    if (verified) {
      // Clear failed attempts on successful authentication
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

    // Increment failed attempts
    const { shouldLock, attemptsRemaining, lockedUntil } = await incrementFailedAttempts(auth);
    if (shouldLock) {
      const lockMinutes = Math.ceil((lockedUntil - new Date()) / 1000 / 60);
      return res.status(423).json({ 
        error: `Too many failed attempts. Account locked for ${lockMinutes} minutes` 
      });
    }

    return res.status(401).json({ 
      error: `Incorrect PIN. ${attemptsRemaining} attempt(s) remaining before account lockout` 
    });
    
  } catch (e) {
    console.log(e);
    res.status(500).json({ error: "Server Error" });
  }
}

const currentlyAuthorized = (_, res) => {
  res.status(200).json(true);
}

const refreshAuth = async (req, res) => {
  const { refreshToken, sessionId } = req.body ?? {};
  if (!refreshToken || !sessionId) {
    return res.status(400).json({ error: "refreshToken and sessionId required" });
  }

  const verification = verifyRefreshToken(refreshToken);
  if (!verification.ok) {
    return res.status(401).json({ error: "Unauthorized - refresh token invalid" });
  }

  const decoded = verification.decoded;
  if (decoded?.typ !== "refresh" || decoded?.sid !== sessionId) {
    return res.status(401).json({ error: "Unauthorized - refresh token invalid" });
  }

  try {
    const session = await Session.findOne({ sessionId });
    if (!session) return res.status(403).json({ error: "Forbidden" });

    // If the JWT is for a different user than the session, treat as forbidden.
    if (String(session.userId) !== String(decoded.sub)) {
      return res.status(403).json({ error: "Forbidden" });
    }

    const matches = await verify(refreshToken, session.refreshToken);
    if (!matches) {
      // Reuse/breach detection: valid refresh JWT for this sessionId but does not match stored hash.
      await Session.deleteOne({ sessionId });
      return res.status(403).json({ error: "Forbidden" });
    }

    const newRefreshToken = generateRefreshToken({ userId: session.userId, sessionId });
    const newRefreshHash = await encrypt(newRefreshToken);
    await Session.updateOne({ sessionId }, { $set: { refreshToken: newRefreshHash } });

    const accessToken = generateAccessToken({ userId: session.userId, sessionId });
    return res.status(200).json({ accessToken, refreshToken: newRefreshToken, sessionId });
  } catch (e) {
    console.log(e);
    return res.status(500).json({ error: "Server Error" });
  }
};

const logout = async (req, res) => {
  const { sessionId } = req.body ?? {};
  if (!sessionId) return res.status(400).json({ error: "sessionId required" });
  try {
    await Session.deleteOne({ sessionId });
    return res.status(200).json({ ok: true });
  } catch (e) {
    console.log(e);
    return res.status(500).json({ error: "Server Error" });
  }
};

const recoverPin = async(_, res) => {
  const code = crypto.randomInt(1000000, 9999999).toString();
  const expires = localDate(new Date(new Date().getTime() + 30 * 60 * 1000));
  try {
    const auth = (await Auth.find())[0];
    const encryptedCode = await encrypt(code);
    auth.recovery = { code: encryptedCode, expires };
    auth.save();
    recoverPinEmail(code);
    res.send({ message: "Email sent for recovery", expires });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Server Error" });
  }
}

const changePin = async(req, res) => {
  const { newPin, recoveryCode } = req.body;
  try {
    const validPin = validatePin(newPin);
    if (!validPin) return res.status(401).json({ error: "Pin format invalid" })
    const auth = (await Auth.find())[0];
    if (!auth.recovery.code || !auth.recovery.expires) return res.status(404).json({ error: "No open recovery" });
    const verifiedCode = await verify(recoveryCode, auth.recovery.code);
    if (!verifiedCode) return res.status(401).json({ error: "Incorrect recovery code" });
    if (auth.recovery.expires < localDate(new Date())) return res.status(401).json({ error: "Recovery code expired" });
    auth.pin = await encrypt(newPin);
    auth.recovery = { code: null, expires: null };
    await auth.save();
    res.status(200).json({ message: "Pin successfully changed" });
  } catch (e) {
    console.log(e);
    res.status(500).json({ error: "Server Error" });
  }
}

export { authenticateDevice, currentlyAuthorized, refreshAuth, logout, recoverPin, changePin }