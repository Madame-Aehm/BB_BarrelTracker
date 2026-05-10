import jwt from "jsonwebtoken";
import env from "../config/env.js";

export const generateAccessToken = ({ userId, sessionId }) => {
  const payload = { sub: userId, sid: sessionId, typ: "access" };
  return jwt.sign(payload, env.jwt.accessSecret, {
    expiresIn: env.jwt.accessExpiresIn,
  });
};

export const generateRefreshToken = ({ userId, sessionId }) => {
  const payload = { sub: userId, sid: sessionId, typ: "refresh" };
  return jwt.sign(payload, env.jwt.refreshSecret, {
    expiresIn: env.jwt.refreshExpiresIn,
  });
};

export const verifyAccessToken = (token) => {
  try {
    return { ok: true, decoded: jwt.verify(token, env.jwt.accessSecret) };
  } catch (err) {
    return { ok: false, error: err };
  }
};

export const verifyRefreshToken = (token) => {
  try {
    return { ok: true, decoded: jwt.verify(token, env.jwt.refreshSecret) };
  } catch (err) {
    return { ok: false, error: err };
  }
};