import multer from "multer";
import path from "path";
import crypto from "crypto";


const ALLOWED_MIME_TYPES = [
  'image/jpeg',
  'image/jpg', 
  'image/png'
];

const ALLOWED_EXTENSIONS = ['.jpg', '.jpeg', '.png'];
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB per file
const MAX_FILES = 10; // Maximum number of files per request

const sanitizeFilename = (filename) => {
  // Remove path components
  const basename = path.basename(filename);
  
  // Remove or replace dangerous characters
  // Keep only alphanumeric, dots, dashes, and underscores
  const sanitized = basename
    .replace(/[^a-zA-Z0-9._-]/g, '_')
    .replace(/\.+/g, '.') // Replace multiple dots with single dot
    .replace(/^\.+/, '') // Remove leading dots
    .substring(0, 255); // Limit length
  
  // Generate unique prefix to avoid collisions
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
    fields: 20, // Max number of non-file fields
    fieldSize: 1024 * 1024, // 1MB max field size
    fieldNameSize: 100, // Max field name size
    headerPairs: 2000 // Max header pairs
  }
});

const handleMulterError = (err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    // Multer-specific errors
    switch (err.code) {
      case 'LIMIT_FILE_SIZE':
        return res.status(413).json({ 
          error: `File too large. Maximum size is ${MAX_FILE_SIZE / 1024 / 1024}MB per file` 
        });
      case 'LIMIT_FILE_COUNT':
        return res.status(413).json({ 
          error: `Too many files. Maximum is ${MAX_FILES} files per request` 
        });
      case 'LIMIT_UNEXPECTED_FILE':
        return res.status(400).json({ 
          error: 'Unexpected file field in upload' 
        });
      case 'LIMIT_FIELD_COUNT':
        return res.status(400).json({ 
          error: 'Too many fields in request' 
        });
      case 'LIMIT_FIELD_SIZE':
        return res.status(413).json({ 
          error: 'Field value too large' 
        });
      default:
        return res.status(400).json({ 
          error: 'File upload error. Please try again' 
        });
    }
  } else if (err) {
    return res.status(400).json({ 
      error: err.message || 'Invalid file upload' 
    });
  }
  
  next();
};

export { upload, handleMulterError, MAX_FILE_SIZE, MAX_FILES };