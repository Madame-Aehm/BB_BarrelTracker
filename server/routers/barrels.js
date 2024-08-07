import express from 'express'
import { addBarrels, getAllBarrelIDS, getBarrel, getSingleID, manageAll, requestDamageReview, returnBarrel, reviewDamageRequest, sendBarrel, updateBarrel, updateHistory } from '../controllers/barrels.js';
import { upload } from '../config/multer.js';

const router = express.Router();


router.get("/get", getBarrel);

router.post("/send", sendBarrel);
router.post("/return", returnBarrel);

router.post("/review-damage", reviewDamageRequest);
router.post("/request-damage-review", upload.any('images'), requestDamageReview);

router.post("/add", addBarrels);

router.get("/manage-all", manageAll);
router.get("/label/all", getAllBarrelIDS);
router.get("/label/number/:number", getSingleID);

router.post("/edit-barrel", upload.any('images'), updateBarrel);
router.post("/edit-history", upload.any('images'), updateHistory);

export default router