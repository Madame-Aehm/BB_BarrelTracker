// Lenient configuration for development/testing
const MAX_FAILED_ATTEMPTS = 10;
const LOCKOUT_DURATION_MS = 10 * 60 * 1000; // 10 minutes
const RESET_ATTEMPTS_AFTER_MS = 5 * 60 * 1000; // 5 minutes

/**
 * Check if account is currently locked
 * @param {Object} auth - Auth document from database
 * @returns {Object} { isLocked: boolean, lockedUntil: Date|null }
 */
const checkAccountLockout = (auth) => {
  if (!auth.failedAttempts) {
    return { isLocked: false, lockedUntil: null };
  }

  const now = new Date();
  
  // Check if account is locked
  if (auth.failedAttempts.lockedUntil && auth.failedAttempts.lockedUntil > now) {
    return { 
      isLocked: true, 
      lockedUntil: auth.failedAttempts.lockedUntil,
      remainingTime: Math.ceil((auth.failedAttempts.lockedUntil - now) / 1000 / 60) // minutes
    };
  }

  return { isLocked: false, lockedUntil: null };
};

/**
 * Increment failed attempt counter and lock account if threshold exceeded
 * @param {Object} auth - Auth document from database
 * @returns {Object} { shouldLock: boolean, attemptsRemaining: number }
 */
const incrementFailedAttempts = async (auth) => {
  const now = new Date();
  
  // Initialize failedAttempts if not present
  if (!auth.failedAttempts) {
    auth.failedAttempts = {
      count: 0,
      lastAttempt: null,
      lockedUntil: null
    };
  }

  // Reset count if last attempt was more than RESET_ATTEMPTS_AFTER_MS ago
  if (auth.failedAttempts.lastAttempt) {
    const timeSinceLastAttempt = now - auth.failedAttempts.lastAttempt;
    if (timeSinceLastAttempt > RESET_ATTEMPTS_AFTER_MS) {
      auth.failedAttempts.count = 0;
    }
  }

  // Increment counter
  auth.failedAttempts.count += 1;
  auth.failedAttempts.lastAttempt = now;

  const attemptsRemaining = MAX_FAILED_ATTEMPTS - auth.failedAttempts.count;

  // Lock account if threshold exceeded
  if (auth.failedAttempts.count >= MAX_FAILED_ATTEMPTS) {
    auth.failedAttempts.lockedUntil = new Date(now.getTime() + LOCKOUT_DURATION_MS);
    await auth.save();
    return { 
      shouldLock: true, 
      attemptsRemaining: 0,
      lockedUntil: auth.failedAttempts.lockedUntil
    };
  }

  await auth.save();
  return { 
    shouldLock: false, 
    attemptsRemaining: attemptsRemaining > 0 ? attemptsRemaining : 0
  };
};

/**
 * Clear failed attempts counter on successful authentication
 * @param {Object} auth - Auth document from database
 */
const clearFailedAttempts = async (auth) => {
  if (!auth.failedAttempts) return;
  
  auth.failedAttempts.count = 0;
  auth.failedAttempts.lastAttempt = null;
  auth.failedAttempts.lockedUntil = null;
  await auth.save();
};

export { checkAccountLockout, incrementFailedAttempts, clearFailedAttempts };
