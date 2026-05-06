import jwt from "jsonwebtoken";
import "dotenv/config";

const ACCESS_EXPIRES_IN = process.env.JWT_ACCESS_EXPIRES_IN ?? "15m";
const REFRESH_EXPIRES_IN = process.env.JWT_REFRESH_EXPIRES_IN ?? "30d";

const requireEnv = (name) => {
  const v = process.env[name];
  if (!v) throw new Error(`Missing required env var: ${name}`);
  return v;
};

export const generateAccessToken = ({ userId, sessionId }) => {
  const payload = { sub: userId, sid: sessionId, typ: "access" };
  return jwt.sign(payload, requireEnv("JWT_ACCESS_SECRET"), {
    expiresIn: ACCESS_EXPIRES_IN,
  });
};

export const generateRefreshToken = ({ userId, sessionId }) => {
  const payload = { sub: userId, sid: sessionId, typ: "refresh" };
  return jwt.sign(payload, requireEnv("JWT_REFRESH_SECRET"), {
    expiresIn: REFRESH_EXPIRES_IN,
  });
};

export const verifyAccessToken = (token) => {
  try {
    return { ok: true, decoded: jwt.verify(token, requireEnv("JWT_ACCESS_SECRET")) };
  } catch (err) {
    return { ok: false, error: err };
  }
};

export const verifyRefreshToken = (token) => {
  try {
    return { ok: true, decoded: jwt.verify(token, requireEnv("JWT_REFRESH_SECRET")) };
  } catch (err) {
    return { ok: false, error: err };
  }
};