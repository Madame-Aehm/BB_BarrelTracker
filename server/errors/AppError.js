export class AppError extends Error {
  constructor(statusCode, message, code = undefined) {
    super(message);
    this.statusCode = statusCode;
    this.code = code;
    this.isOperational = true;
  }
}

export const badRequest = (message, code) => new AppError(400, message, code);
export const unauthorized = (message, code) => new AppError(401, message, code);
export const forbidden = (message, code) => new AppError(403, message, code);
export const notFound = (message, code) => new AppError(404, message, code);
export const conflict = (message, code) => new AppError(409, message, code);
export const locked = (message, code) => new AppError(423, message, code);
export const payloadTooLarge = (message, code) => new AppError(413, message, code);
