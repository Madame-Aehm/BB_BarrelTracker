import "dotenv/config";

const requireString = (name) => {
  const v = process.env[name];
  if (typeof v !== "string" || v.trim() === "") {
    throw new Error(`Missing required env var: ${name}`);
  }
  return v.trim();
};

const optionalString = (name, fallback) => {
  const v = process.env[name];
  if (typeof v !== "string" || v.trim() === "") return fallback;
  return v.trim();
};

const parsePort = (raw, fallback) => {
  const v = raw ?? "";
  if (typeof v !== "string" || v.trim() === "") return fallback;
  const n = Number(v);
  if (!Number.isFinite(n) || !Number.isInteger(n) || n <= 0) {
    throw new Error(`Invalid env var PORT: expected positive integer, got "${v}"`);
  }
  return n;
};

const parseAllowedOrigins = (raw) => {
  if (typeof raw !== "string" || raw.trim() === "") {
    return ["http://localhost:3000", "http://localhost:5173"];
  }

  const list = raw
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);

  return list.length
    ? list
    : ["http://localhost:3000", "http://localhost:5173"];
};

const env = Object.freeze({
  port: parsePort(process.env.PORT, 5000),
  nodeEnv: optionalString("NODE_ENV", "development"),

  allowedOrigins: parseAllowedOrigins(process.env.ALLOWED_ORIGINS),

  mongoUri: requireString("MONGO_URI"),

  jwt: {
    accessSecret: requireString("JWT_ACCESS_SECRET"),
    refreshSecret: requireString("JWT_REFRESH_SECRET"),
    accessExpiresIn: optionalString("JWT_ACCESS_EXPIRES_IN", "15m"),
    refreshExpiresIn: optionalString("JWT_REFRESH_EXPIRES_IN", "30d"),
  },

  email: {
    user: requireString("USER"),
    pass: requireString("PASS"),
    pocEmail: requireString("POC_EMAIL"),
  },

  cloudinary: {
    cloudName: requireString("CLOUD_NAME"),
    apiKey: requireString("CLOUD_APIKEY"),
    apiSecret: requireString("CLOUD_APISECRET"),
  },
});

export default env;
