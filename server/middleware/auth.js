import { verifyAccessToken } from "../utils/jwt.js";
import { asyncHandler } from "../errors/asyncHandler.js";
import { unauthorized, notFound } from "../errors/AppError.js";

export function createAuthenticate({ authRepository }) {
  return asyncHandler(async (req, res, next) => {
    if (!req.headers.authorization) {
      throw unauthorized("Unauthorized - please authenticate");
    }

    const token = req.headers.authorization.split(" ")[1];
    const verification = verifyAccessToken(token);
    if (!verification.ok) {
      console.error("verification error", verification.error);
      throw unauthorized("Unauthorized - token invalid");
    }

    const decoded = verification.decoded;
    if (decoded?.typ !== "access") {
      throw unauthorized("Unauthorized - token invalid");
    }

    const authFound = await authRepository.findById(decoded.sub);
    if (!authFound) throw notFound("Unauthorized - ID invalid");
    req.auth = authFound;
    next();
  });
}
