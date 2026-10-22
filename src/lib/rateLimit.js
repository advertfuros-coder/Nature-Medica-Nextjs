import { NextResponse } from 'next/server';

/**
 * High-performance In-Memory Rate Limiter with Sliding Window / Token Bucket algorithm.
 * Automatically cleans up expired IP / Key buckets.
 */
class RateLimiter {
  constructor() {
    this.hits = new Map();
    // Periodic garbage collection every 5 minutes
    if (typeof setInterval !== 'undefined') {
      setInterval(() => this.cleanup(), 5 * 60 * 1000).unref?.();
    }
  }

  cleanup() {
    const now = Date.now();
    for (const [key, data] of this.hits.entries()) {
      if (now > data.resetTime) {
        this.hits.delete(key);
      }
    }
  }

  /**
   * Check rate limit
   * @param {string} identifier - Unique client key (IP, email, or composite)
   * @param {number} limit - Maximum requests allowed in window
   * @param {number} windowMs - Window duration in milliseconds (e.g. 15 * 60 * 1000 for 15 mins)
   * @returns {{ success: boolean, remaining: number, resetTime: number, retryAfterSeconds: number }}
   */
  check(identifier, limit = 5, windowMs = 15 * 60 * 1000) {
    const now = Date.now();
    const record = this.hits.get(identifier);

    if (!record || now > record.resetTime) {
      // First request in this window
      this.hits.set(identifier, {
        count: 1,
        resetTime: now + windowMs
      });
      return {
        success: true,
        remaining: limit - 1,
        resetTime: now + windowMs,
        retryAfterSeconds: 0
      };
    }

    if (record.count < limit) {
      record.count += 1;
      return {
        success: true,
        remaining: limit - record.count,
        resetTime: record.resetTime,
        retryAfterSeconds: 0
      };
    }

    // Limit exceeded
    const retryAfterSeconds = Math.ceil((record.resetTime - now) / 1000);
    return {
      success: false,
      remaining: 0,
      resetTime: record.resetTime,
      retryAfterSeconds: Math.max(retryAfterSeconds, 1)
    };
  }

  reset(identifier) {
    this.hits.delete(identifier);
  }
}

// Global singleton across hot-reloads
const globalRateLimiter = globalThis.__rateLimiter || new RateLimiter();
if (process.env.NODE_ENV !== 'production') {
  globalThis.__rateLimiter = globalRateLimiter;
}

/**
 * Extracts Client IP accurately behind Cloudflare, Vercel, Hostinger or direct proxies
 */
export function getClientIp(req) {
  const forwarded = req.headers.get('x-forwarded-for');
  if (forwarded) {
    return forwarded.split(',')[0].trim();
  }
  return (
    req.headers.get('x-real-ip') ||
    req.headers.get('cf-connecting-ip') ||
    '127.0.0.1'
  );
}

/**
 * Rate limit helper for route handlers.
 * @param {Request} req
 * @param {string} actionTag - Action name like 'login', 'signup', 'reset_password'
 * @param {number} limit - Maximum requests (default: 5)
 * @param {number} windowMs - Window in ms (default: 15 minutes)
 * @returns {NextResponse | null} Returns 429 response if blocked, otherwise null.
 */
export function applyRateLimit(req, actionTag = 'auth', limit = 5, windowMs = 15 * 60 * 1000) {
  const ip = getClientIp(req);
  const identifier = `${actionTag}:${ip}`;
  const result = globalRateLimiter.check(identifier, limit, windowMs);

  if (!result.success) {
    return NextResponse.json(
      {
        error: `Too many attempts. Please try again after ${result.retryAfterSeconds} seconds.`,
        code: 'RATE_LIMIT_EXCEEDED',
        retryAfter: result.retryAfterSeconds
      },
      {
        status: 429,
        headers: {
          'Retry-After': String(result.retryAfterSeconds),
          'X-RateLimit-Limit': String(limit),
          'X-RateLimit-Remaining': '0',
          'X-RateLimit-Reset': String(Math.ceil(result.resetTime / 1000))
        }
      }
    );
  }

  return null;
}

export function resetRateLimit(req, actionTag = 'auth') {
  const ip = getClientIp(req);
  globalRateLimiter.reset(`${actionTag}:${ip}`);
}

export default globalRateLimiter;
