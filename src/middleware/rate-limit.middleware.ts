import type { MiddlewareHandler } from "hono";

interface RateLimitConfig {
	windowMs: number; // Time window in milliseconds
	maxRequests: number; // Maximum requests per window
}

interface RateLimitStore {
	[key: string]: {
		count: number;
		resetTime: number;
	};
}

// In-memory store for rate limiting
// For production, use Redis for distributed rate limiting
const store: RateLimitStore = {};

// Clean up old entries every 5 minutes
setInterval(
	() => {
		const now = Date.now();
		Object.keys(store).forEach((key) => {
			if (store[key].resetTime < now) {
				delete store[key];
			}
		});
	},
	5 * 60 * 1000,
);

export function rateLimiter(config: RateLimitConfig): MiddlewareHandler {
	return async (c, next) => {
		// Get client identifier (IP address or user ID)
		const identifier =
			c.req.header("x-forwarded-for") || c.req.header("x-real-ip") || "unknown";

		const key = `${identifier}:${c.req.path}`;
		const now = Date.now();

		// Initialize or get existing rate limit data
		if (!store[key] || store[key].resetTime < now) {
			store[key] = {
				count: 0,
				resetTime: now + config.windowMs,
			};
		}

		// Increment request count
		store[key].count++;

		// Set rate limit headers
		const remaining = Math.max(0, config.maxRequests - store[key].count);
		const resetTime = Math.ceil(store[key].resetTime / 1000);

		c.header("X-RateLimit-Limit", config.maxRequests.toString());
		c.header("X-RateLimit-Remaining", remaining.toString());
		c.header("X-RateLimit-Reset", resetTime.toString());

		// Check if rate limit exceeded
		if (store[key].count > config.maxRequests) {
			const retryAfter = Math.ceil((store[key].resetTime - now) / 1000);
			c.header("Retry-After", retryAfter.toString());

			return c.json(
				{
					error: "Too Many Requests",
					message: `Rate limit exceeded. Please try again in ${retryAfter} seconds.`,
				},
				429,
			);
		}

		await next();
	};
}

// Pre-configured rate limiters for common use cases
export const authRateLimiter = rateLimiter({
	windowMs: 15 * 60 * 1000, // 15 minutes
	maxRequests: 5, // 5 requests per 15 minutes
});

export const generalRateLimiter = rateLimiter({
	windowMs: 60 * 1000, // 1 minute
	maxRequests: 60, // 60 requests per minute
});
