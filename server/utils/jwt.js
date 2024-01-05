import jwt from "jsonwebtoken";
import 'dotenv/config'

export const generateToken = (auth) => {
  const payload = {
    sub: auth._id
  }
  const options = {
    expiresIn: "5d",
  };
  const token = jwt.sign(payload, process.env.JWT_SECRET, options)
  return token
}