import express from 'express'
import { verifyPin } from '../utils/bcrypt.js';
import Auth from '../models/auth.js';
import { generateToken } from '../utils/jwt.js';
import authenticate from '../middleware/auth.js';

const router = express.Router();

router.post("/authenticate", async(req, res) => {
  const { pin } = req.body;
  try {
    const auth = await Auth.find();
    if (auth) {
      const verified = await verifyPin(pin, auth[0].pin);
      if (verified) {
        const token = generateToken(auth[0]);
        return res.status(200).json({ token });
      }
      return res.status(401).json({ error: "Incorrect PIN" })
    } 
    res.status(404).json({ error: "No Auth" })
  } catch (e) {
    console.log(e);
    res.status(500).json({ error: "Server Error" });
  }
})

router.get("/authorized", authenticate, (_, res) => {
  res.status(200).json({ authorized: true });
})

export default router