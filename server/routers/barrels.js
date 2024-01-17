import express from 'express'
import { addBarrels, getAllBarrelIDS, getBarrel, getHistory, getSingleID, requestDamageReview, returnBarrel, reviewDamageRequest, sendBarrel } from '../controllers/barrels.js';

const router = express.Router();


router.get("/get/:params", getBarrel);
router.get("/history/:params", getHistory);

router.post("/send", sendBarrel);
router.post("/return", returnBarrel);

router.post("/review-damage", reviewDamageRequest);
router.post("/request-damage-review", requestDamageReview);

router.post("/add", addBarrels);

router.get("/label/all", getAllBarrelIDS);
router.get("/label/number/:number", getSingleID);

export default router