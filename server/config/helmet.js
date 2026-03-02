import helmet from "helmet";

/**
 * Configure Helmet security headers for Express application
 * Provides protection against common web vulnerabilities
 */
const helmetConfig = () => {
  const isProduction = process.env.NODE_ENV === "production";

  return helmet({
    // Content Security Policy - controls which resources can be loaded
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        baseUri: ["'self'"],
        
        // Allow scripts from self
        scriptSrc: ["'self'"],
        
        // Allow styles from self and inline styles (for future flexibility)
        styleSrc: ["'self'", "'unsafe-inline'"],
        
        // Allow images from self, data URIs, and Cloudinary
        imgSrc: [
          "'self'",
          "data:",
          "https:",
          "https://res.cloudinary.com",
          "https://cloudinary.com"
        ],
        
        // Allow connections to self and Cloudinary API
        connectSrc: [
          "'self'",
          "https://api.cloudinary.com",
          "https://res.cloudinary.com"
        ],
        
        // Font sources
        fontSrc: ["'self'", "data:"],
        
        // Disable object embeds (Flash, etc.)
        objectSrc: ["'none'"],
        
        // Media sources
        mediaSrc: ["'self'", "https://res.cloudinary.com"],
        
        // Prevent framing (clickjacking protection)
        frameSrc: ["'none'"],
        
        // Upgrade insecure requests in production
        ...(isProduction && { upgradeInsecureRequests: [] }),
      },
      // Report violations in development, enforce in production
      reportOnly: !isProduction,
    },

    // HTTP Strict Transport Security (HSTS) - enforce HTTPS in production
    strictTransportSecurity: isProduction
      ? {
          maxAge: 31536000, // 1 year in seconds
          includeSubDomains: true,
          preload: true,
        }
      : false,

    // Cross-Origin-Embedder-Policy - control what can be embedded
    crossOriginEmbedderPolicy: false, // Set to false to allow Cloudinary images

    // Cross-Origin-Opener-Policy - isolate browsing context
    crossOriginOpenerPolicy: { policy: "same-origin" },

    // Cross-Origin-Resource-Policy - control who can load your resources
    crossOriginResourcePolicy: { policy: "cross-origin" }, // Allow Cloudinary

    // Referrer Policy - control information sent in Referer header
    referrerPolicy: { policy: "strict-origin-when-cross-origin" },

    // X-Frame-Options - prevent clickjacking
    xFrameOptions: { action: "deny" },

    // X-Content-Type-Options - prevent MIME sniffing
    xContentTypeOptions: true,

    // X-DNS-Prefetch-Control - control DNS prefetching
    xDnsPrefetchControl: { allow: false },

    // X-Download-Options - prevent IE from executing downloads
    xDownloadOptions: true,

    // X-Permitted-Cross-Domain-Policies - control Adobe products behavior
    xPermittedCrossDomainPolicies: { permittedPolicies: "none" },

    // Hide X-Powered-By header
    hidePoweredBy: true,
  });
};

export default helmetConfig;
