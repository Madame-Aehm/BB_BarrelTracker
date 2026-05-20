import express from 'express'
import { addBarrels, getAllBarrelIDS, getBarrel, getSingleID, manageAll, requestDamageReview, returnBarrel, reviewDamageRequest, sendBarrel, updateBarrel, updateHistory } from '../controllers/barrels.js';
import { upload, handleMulterError } from '../config/multer.js';
import { uploadRateLimiter } from '../middleware/rateLimiter.js';
import { asyncHandler } from '../errors/asyncHandler.js';

const router = express.Router();

router.get("/get", asyncHandler(getBarrel));

router.post("/send", asyncHandler(sendBarrel));
router.post("/return", asyncHandler(returnBarrel));

router.post("/review-damage", asyncHandler(reviewDamageRequest));
router.post(
  "/request-damage-review",
  uploadRateLimiter,
  upload.any('images'),
  handleMulterError,
  asyncHandler(requestDamageReview)
);

router.post("/add", asyncHandler(addBarrels));

router.get("/manage-all", asyncHandler(manageAll));
router.get("/label/all", asyncHandler(getAllBarrelIDS));
router.get("/label/number/:number", asyncHandler(getSingleID));

router.post(
  "/edit-barrel",
  uploadRateLimiter,
  upload.any('images'),
  handleMulterError,
  asyncHandler(updateBarrel)
);
router.post(
  "/edit-history",
  uploadRateLimiter,
  upload.any('images'),
  handleMulterError,
  asyncHandler(updateHistory)
);

export default router
