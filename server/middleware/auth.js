import jwt from "jsonwebtoken"
import 'dotenv/config'


const authenticate = (req, res, next) => {
  if (req.headers.authorization) {
    const token = req.headers.authorization.split(" ")[1];
    jwt.verify(token, process.env.JWT_SECRET, (error, decoded) => {
      if (error) {
        console.log("verification error", error);
        return res.status(401).json({ error: "Unauthorized - token invalid" });
      }
      return next();
    });
  } else {
    res.status(401).json({ error: "Unauthorized - please authenticate" });
  }
}

export default authenticate