import express from "express";
import { upload, handleMulterError } from "../config/multer.js";
import { uploadRateLimiter } from "../middleware/rateLimiter.js";
import { asyncHandler } from "../errors/asyncHandler.js";

export function createBarrelRouter(controllers) {
  const router = express.Router();

  router.get("/get", asyncHandler(controllers.getBarrel));

  router.post("/send", asyncHandler(controllers.sendBarrel));
  router.post("/return", asyncHandler(controllers.returnBarrel));

  router.post("/review-damage", asyncHandler(controllers.reviewDamageRequest));
  router.post(
    "/request-damage-review",
    uploadRateLimiter,
    upload.any("images"),
    handleMulterError,
    asyncHandler(controllers.requestDamageReview)
  );

  router.post("/add", asyncHandler(controllers.addBarrels));

  router.get("/manage-all", asyncHandler(controllers.manageAll));
  router.get("/label/all", asyncHandler(controllers.getAllBarrelIDS));
  router.get("/label/number/:number", asyncHandler(controllers.getSingleID));

  router.post(
    "/edit-barrel",
    uploadRateLimiter,
    upload.any("images"),
    handleMulterError,
    asyncHandler(controllers.updateBarrel)
  );
  router.post(
    "/edit-history",
    uploadRateLimiter,
    upload.any("images"),
    handleMulterError,
    asyncHandler(controllers.updateHistory)
  );

  return router;
}
