import multer from "multer";
import path from "path";
import crypto from "crypto";
import { AppError, badRequest, payloadTooLarge } from "../errors/AppError.js";

const ALLOWED_MIME_TYPES = [
  'image/jpeg',
  'image/jpg', 
  'image/png'
];

const ALLOWED_EXTENSIONS = ['.jpg', '.jpeg', '.png'];
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB per file
const MAX_FILES = 10; // Maximum number of files per request

const sanitizeFilename = (filename) => {
  const basename = path.basename(filename);
  
  const sanitized = basename
    .replace(/[^a-zA-Z0-9._-]/g, '_')
    .replace(/\.+/g, '.')
    .replace(/^\.+/, '')
    .substring(0, 255);
  
  const uniquePrefix = crypto.randomBytes(8).toString('hex');
  const ext = path.extname(sanitized);
  const nameWithoutExt = path.basename(sanitized, ext);
  
  return `${uniquePrefix}_${nameWithoutExt}${ext}`;
};

const validateFileType = (file) => {
  const extension = path.extname(file.originalname).toLowerCase();
  const mimeType = file.mimetype.toLowerCase();

  if (!ALLOWED_EXTENSIONS.includes(extension)) {
    return {
      valid: false,
      error: `File extension '${extension}' not allowed. Allowed: ${ALLOWED_EXTENSIONS.join(', ')}`
    };
  }
  
  if (!ALLOWED_MIME_TYPES.includes(mimeType)) {
    return {
      valid: false,
      error: `File type '${mimeType}' not allowed. Allowed: ${ALLOWED_MIME_TYPES.join(', ')}`
    };
  }

  const expectedMimeTypes = {
    '.jpg': ['image/jpeg', 'image/jpg'],
    '.jpeg': ['image/jpeg', 'image/jpg'],
    '.png': ['image/png']
  };
  
  if (!expectedMimeTypes[extension]?.includes(mimeType)) {
    return {
      valid: false,
      error: 'File extension and content type do not match'
    };
  }
  
  return { valid: true };
};

const fileFilter = (req, file, cb) => {
  const validation = validateFileType(file);
  
  if (!validation.valid) {
    return cb(new Error(validation.error), false);
  }

  file.originalname = sanitizeFilename(file.originalname);
  
  cb(null, true);
};

const upload = multer({
  storage: multer.diskStorage({}),
  fileFilter: fileFilter,
  limits: {
    fileSize: MAX_FILE_SIZE,
    files: MAX_FILES,
    fields: 20,
    fieldSize: 1024 * 1024,
    fieldNameSize: 100,
    headerPairs: 2000
  }
});

const multerToAppError = (err) => {
  if (err instanceof multer.MulterError) {
    switch (err.code) {
      case 'LIMIT_FILE_SIZE':
        return payloadTooLarge(
          `File too large. Maximum size is ${MAX_FILE_SIZE / 1024 / 1024}MB per file`
        );
      case 'LIMIT_FILE_COUNT':
        return payloadTooLarge(
          `Too many files. Maximum is ${MAX_FILES} files per request`
        );
      case 'LIMIT_UNEXPECTED_FILE':
        return badRequest('Unexpected file field in upload');
      case 'LIMIT_FIELD_COUNT':
        return badRequest('Too many fields in request');
      case 'LIMIT_FIELD_SIZE':
        return payloadTooLarge('Field value too large');
      default:
        return badRequest('File upload error. Please try again');
    }
  }
  if (err) {
    return badRequest(err.message || 'Invalid file upload');
  }
  return null;
};

const handleMulterError = (err, req, res, next) => {
  const appErr = multerToAppError(err);
  if (appErr instanceof AppError) return next(appErr);
  next();
};

export { upload, handleMulterError, MAX_FILE_SIZE, MAX_FILES };
