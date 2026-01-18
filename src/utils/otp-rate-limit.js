// Rate limiting for OTP requests
// Prevents spam and abuse

const otpRateLimits = new Map();

// Clean up old entries every 10 minutes
setInterval(() => {
  const now = Date.now();
  for (const [key, data] of otpRateLimits.entries()) {
    if (now - data.firstAttempt > 600000) {
      // 10 minutes
      otpRateLimits.delete(key);
    }
  }
}, 600000);

export function checkOTPRateLimit(phone, ip) {
  const key = `${phone}_${ip}`;
  const now = Date.now();

  const limit = otpRateLimits.get(key);

  if (!limit) {
    // First request
    otpRateLimits.set(key, {
      count: 1,
      firstAttempt: now,
      lastAttempt: now,
    });
    return { allowed: true, remainingAttempts: 4 };
  }

  // Check if within 10-minute window
  const timeSinceFirst = now - limit.firstAttempt;

  if (timeSinceFirst > 600000) {
    // Reset after 10 minutes
    otpRateLimits.set(key, {
      count: 1,
      firstAttempt: now,
      lastAttempt: now,
    });
    return { allowed: true, remainingAttempts: 4 };
  }

  // Check attempts in window
  if (limit.count >= 5) {
    const timeUntilReset = Math.ceil((600000 - timeSinceFirst) / 60000);
    return {
      allowed: false,
      remainingAttempts: 0,
      retryAfter: timeUntilReset,
      message: `Too many OTP requests. Please try again after ${timeUntilReset} minutes.`,
    };
  }

  // Check minimum time between requests (30 seconds)
  const timeSinceLast = now - limit.lastAttempt;
  if (timeSinceLast < 30000) {
    const waitTime = Math.ceil((30000 - timeSinceLast) / 1000);
    return {
      allowed: false,
      remainingAttempts: 5 - limit.count,
      retryAfter: waitTime,
      message: `Please wait ${waitTime} seconds before requesting another OTP.`,
    };
  }

  // Increment count
  limit.count++;
  limit.lastAttempt = now;
  otpRateLimits.set(key, limit);

  return {
    allowed: true,
    remainingAttempts: 5 - limit.count,
  };
}

export function resetOTPRateLimit(phone, ip) {
  const key = `${phone}_${ip}`;
  otpRateLimits.delete(key);
}
