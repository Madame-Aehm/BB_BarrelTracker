import crypto from 'crypto';
import { encrypt, verify } from '../utils/bcrypt.js';
import Auth from '../models/auth.js';
import { generateToken } from '../utils/jwt.js';
import localDate from "../utils/localDate.js";
import validatePin from '../utils/validatePin.js';
import { recoverPinEmail } from '../utils/sendEmail.js';
import { checkAccountLockout, incrementFailedAttempts, clearFailedAttempts } from '../utils/accountLockout.js';

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
      const token = generateToken(auth);
      return res.status(200).json({ token });
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

export { authenticateDevice, currentlyAuthorized, recoverPin, changePin }