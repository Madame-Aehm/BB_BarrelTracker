import mongoose from "mongoose";
import { MongoServerError } from "mongodb";
import { AppError } from "./AppError.js";

const getValidationMessage = (err) => {
  const first = Object.values(err.errors ?? {})[0];
  return first?.message ?? "Validation failed";
};

export const errorHandler = (err, req, res, _next) => {
  let statusCode = 500;
  let message = "Server Error";

  if (err instanceof AppError) {
    statusCode = err.statusCode;
    message = err.message;
  } else if (err instanceof mongoose.Error.ValidationError) {
    statusCode = 400;
    message = getValidationMessage(err);
  } else if (err instanceof mongoose.Error.CastError) {
    statusCode = 400;
    message = "Invalid ID or format";
  } else if (err instanceof MongoServerError && err.code === 11000) {
    statusCode = 409;
    message = "Name already in use";
  } else if (err instanceof SyntaxError && err.status === 400 && "body" in err) {
    statusCode = 400;
    message = "Invalid JSON";
  }

  if (statusCode >= 500) {
    console.error(`[${req.method}] ${req.path}`, err);
  } else if (err.code) {
    console.error(`[${req.method}] ${req.path} (${err.code}):`, message);
  }

  res.status(statusCode).json({ error: message });
};
