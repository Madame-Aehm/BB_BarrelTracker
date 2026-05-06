import "dotenv/config";
import auth from "../models/auth.js";
import { verifyAccessToken } from "../utils/jwt.js";


const authenticate = async(req, res, next) => {
  if (req.headers.authorization) {
    const token = req.headers.authorization.split(" ")[1];
    const verification = verifyAccessToken(token);
    if (!verification.ok) {
      console.log("verification error", verification.error);
      return res.status(401).json({ error: "Unauthorized - token invalid" });
    }

    const decoded = verification.decoded;
    if (decoded?.typ !== "access") {
      return res.status(401).json({ error: "Unauthorized - token invalid" });
    }

    try {
      const authFound = await auth.findById(decoded.sub);
      if (!authFound) return res.status(404).json({ error: "Unauthorized - ID invalid" });
      req.auth = authFound;
      next();
    } catch (e) {
      console.log(e);
      return res.status(500).json({ error: "Server Error" });
    };
  } else {
    res.status(401).json({ error: "Unauthorized - please authenticate" });
  }
}

export default authenticate