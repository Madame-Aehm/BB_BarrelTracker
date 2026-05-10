import rateLimit from 'express-rate-limit';

// Lenient configuration for development/testing
// 10 attempts per 5 minutes for authentication
const authRateLimiter = rateLimit({
  windowMs: 5 * 60 * 1000, // 5 minutes
  max: 10, // 10 requests per window
  message: { error: "Too many authentication attempts from this IP, please try again after 5 minutes" },
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
  skipSuccessfulRequests: false, // Count successful requests
  handler: (req, res) => {
    res.status(429).json({ 
      error: "Too many authentication attempts from this IP, please try again after 5 minutes" 
    });
  }
});

// Refresh can be called periodically by legitimate clients; keep this lenient.
// Still useful to protect bcrypt/DB work from abuse.
const refreshRateLimiter = rateLimit({
  windowMs: 5 * 60 * 1000, // 5 minutes
  max: 60, // 60 requests per window per IP
  message: { error: "Too many refresh attempts from this IP, please try again later" },
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) => {
    res.status(429).json({
      error: "Too many refresh attempts from this IP, please try again later",
    });
  },
});

// Logout is cheap but can be spammed to generate DB writes.
const logoutRateLimiter = rateLimit({
  windowMs: 5 * 60 * 1000, // 5 minutes
  max: 30,
  message: { error: "Too many logout requests from this IP, please try again later" },
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) => {
    res.status(429).json({
      error: "Too many logout requests from this IP, please try again later",
    });
  },
});

// 10 requests per hour for PIN recovery
const recoverPinLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 10,
  message: { error: "Too many recovery requests from this IP, please try again later" },
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) => {
    res.status(429).json({ 
      error: "Too many recovery requests from this IP, please try again later" 
    });
  }
});

// 10 attempts per 5 minutes for changing PIN
const changePinLimiter = rateLimit({
  windowMs: 5 * 60 * 1000, // 5 minutes
  max: 10,
  message: { error: "Too many PIN change attempts from this IP, please try again after 5 minutes" },
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) => {
    res.status(429).json({ 
      error: "Too many PIN change attempts from this IP, please try again after 5 minutes" 
    });
  }
});

const uploadRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 20, // 20 upload requests per 15 minutes
  message: { error: "Too many file uploads from this IP, please try again later" },
  standardHeaders: true,
  legacyHeaders: false,
  skipSuccessfulRequests: false,
  handler: (req, res) => {
    res.status(429).json({ 
      error: "Too many file uploads from this IP, please try again after 15 minutes" 
    });
  }
});

export {
  authRateLimiter,
  refreshRateLimiter,
  logoutRateLimiter,
  recoverPinLimiter,
  changePinLimiter,
  uploadRateLimiter,
};
