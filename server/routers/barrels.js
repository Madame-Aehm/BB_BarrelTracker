import express from 'express'
import { addBarrels, getAllBarrelIDS, getBarrel, getSingleID, manageAll, requestDamageReview, returnBarrel, reviewDamageRequest, sendBarrel, updateBarrel, updateHistory } from '../controllers/barrels.js';
import { upload, handleMulterError } from '../config/multer.js';
import { uploadRateLimiter } from '../middleware/rateLimiter.js';

const router = express.Router();


router.get("/get", getBarrel);

router.post("/send", sendBarrel);
router.post("/return", returnBarrel);

router.post("/review-damage", reviewDamageRequest);
router.post("/request-damage-review", uploadRateLimiter, upload.any('images'), handleMulterError, requestDamageReview);

router.post("/add", addBarrels);

router.get("/manage-all", manageAll);
router.get("/label/all", getAllBarrelIDS);
router.get("/label/number/:number", getSingleID);

router.post("/edit-barrel", uploadRateLimiter, upload.any('images'), handleMulterError, updateBarrel);
router.post("/edit-history", uploadRateLimiter, upload.any('images'), handleMulterError, updateHistory);

export default router