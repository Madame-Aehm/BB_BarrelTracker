import express from 'express'
import { addBarrels, getAllBarrelIDS, getBarrelById, getBarrelByNumber, getSingleID } from '../controllers/barrels.js';

const router = express.Router();

router.get("/id/:id", getBarrelById);
router.get("/number/:number", getBarrelByNumber);

router.post("/add", addBarrels);

// for label generation
router.get("/label/all", getAllBarrelIDS);
router.get("/label/number/:number", getSingleID);

export default router