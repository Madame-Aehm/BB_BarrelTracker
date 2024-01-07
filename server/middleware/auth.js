import jwt from "jsonwebtoken"
import 'dotenv/config'
import auth from "../models/auth.js";


const authenticate = (req, res, next) => {
  if (req.headers.authorization) {
    const token = req.headers.authorization.split(" ")[1];
    jwt.verify(token, process.env.JWT_SECRET, async(error, decoded) => {
      if (error) {
        console.log("verification error", error);
        return res.status(401).json({ error: "Unauthorized - token invalid" });
      }
      const authFound = await auth.findById(decoded.sub);
      if (!authFound) return res.status(404).json({ error: "Unauthorized - ID invalid" });
      req.auth = authFound;
      next();
    });
  } else {
    res.status(401).json({ error: "Unauthorized - please authenticate" });
  }
}

export default authenticate