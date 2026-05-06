import express from 'express'
import authenticate from '../middleware/auth.js';
import { authenticateDevice, changePin, currentlyAuthorized, logout, recoverPin, refreshAuth } from '../controllers/auth.js';
import { authRateLimiter, recoverPinLimiter, changePinLimiter } from '../middleware/rateLimiter.js';

const router = express.Router();

router.post("/authenticate", authRateLimiter, authenticateDevice);

router.post("/refresh", refreshAuth);

router.post("/logout", logout);

router.get("/authorized", authenticate, currentlyAuthorized);

router.get("/recover-pin", recoverPinLimiter, recoverPin);

router.post("/change-pin", changePinLimiter, changePin);

export default router