import express from "express";
import { asyncHandler } from "../errors/asyncHandler.js";
import {
  authRateLimiter,
  refreshRateLimiter,
  logoutRateLimiter,
  recoverPinLimiter,
  changePinLimiter,
} from "../middleware/rateLimiter.js";

export function createAuthRouter(controllers, authenticate) {
  const router = express.Router();

  router.post(
    "/authenticate",
    authRateLimiter,
    asyncHandler(controllers.authenticateDevice)
  );

  router.post("/refresh", refreshRateLimiter, asyncHandler(controllers.refreshAuth));

  router.post(
    "/logout",
    authenticate,
    logoutRateLimiter,
    asyncHandler(controllers.logout)
  );

  router.get("/authorized", authenticate, controllers.currentlyAuthorized);

  router.get("/recover-pin", recoverPinLimiter, asyncHandler(controllers.recoverPin));

  router.post("/change-pin", changePinLimiter, asyncHandler(controllers.changePin));

  return router;
}
