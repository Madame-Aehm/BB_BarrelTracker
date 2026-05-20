import express from 'express'
import authenticate from '../middleware/auth.js';
import { authenticateDevice, changePin, currentlyAuthorized, logout, recoverPin, refreshAuth } from '../controllers/auth.js';
import { asyncHandler } from '../errors/asyncHandler.js';
import {
  authRateLimiter,
  refreshRateLimiter,
  logoutRateLimiter,
  recoverPinLimiter,
  changePinLimiter,
} from '../middleware/rateLimiter.js';

const router = express.Router();

router.post("/authenticate", authRateLimiter, asyncHandler(authenticateDevice));

router.post("/refresh", refreshRateLimiter, asyncHandler(refreshAuth));

router.post("/logout", authenticate, logoutRateLimiter, asyncHandler(logout));

router.get("/authorized", authenticate, currentlyAuthorized);

router.get("/recover-pin", recoverPinLimiter, asyncHandler(recoverPin));

router.post("/change-pin", changePinLimiter, asyncHandler(changePin));

export default router
