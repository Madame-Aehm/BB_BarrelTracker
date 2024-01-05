import express from 'express'
import { addBarrels, getAllBarrelIDS, getBarrelById, getBarrelByNumber, getSingleID, requestDamageReview, returnBarrel, reviewDamageRequest, sendBarrel } from '../controllers/barrels.js';

const router = express.Router();

// review before update
router.get("/id/:id", getBarrelById);
router.get("/number/:number", getBarrelByNumber);

router.post("/send", sendBarrel);
router.post("/return", returnBarrel);

router.post("/review-damage", reviewDamageRequest);
router.post("/request-damage-review", requestDamageReview);

router.post("/add", addBarrels);

// for label generation
router.get("/label/all", getAllBarrelIDS);
router.get("/label/number/:number", getSingleID);

export default router