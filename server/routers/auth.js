import express from 'express'
import authenticate from '../middleware/auth.js';
import { authenticateDevice, changePin, currentlyAuthorized, recoverPin } from '../controllers/auth.js';

const router = express.Router();

router.post("/authenticate", authenticateDevice);

router.get("/authorized", authenticate, currentlyAuthorized);

router.get("/recover-pin", recoverPin);

router.post("/change-pin", changePin);

export default router