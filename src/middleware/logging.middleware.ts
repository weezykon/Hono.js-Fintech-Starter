import { randomUUID } from "node:crypto";
import type { MiddlewareHandler } from "hono";

export const logger: MiddlewareHandler = async (c, next) => {
	const requestId = randomUUID();
	const startTime = Date.now();

	// Set request ID in context for use in other middleware
	c.set("requestId", requestId);

	// Log incoming request
	console.log({
		level: "info",
		type: "request",
		requestId,
		timestamp: new Date().toISOString(),
		method: c.req.method,
		path: c.req.path,
		url: c.req.url,
	});

	await next();

	// Log response
	const duration = Date.now() - startTime;
	console.log({
		level: "info",
		type: "response",
		requestId,
		timestamp: new Date().toISOString(),
		method: c.req.method,
		path: c.req.path,
		status: c.res.status,
		duration: `${duration}ms`,
	});
};
