import { randomUUID } from "node:crypto";
import type { MiddlewareHandler } from "hono";

export const errorHandler: MiddlewareHandler = async (c, next) => {
	try {
		await next();
	} catch (err) {
		const errorId = randomUUID();
		const timestamp = new Date().toISOString();

		// Structured error logging
		console.error({
			errorId,
			timestamp,
			method: c.req.method,
			path: c.req.path,
			error:
				err instanceof Error
					? {
							message: err.message,
							stack: err.stack,
							name: err.name,
						}
					: String(err),
		});

		// Return user-friendly error with tracking ID
		return c.json(
			{
				error: "Internal Server Error",
				errorId,
				message:
					process.env.NODE_ENV === "development" && err instanceof Error
						? err.message
						: "An unexpected error occurred. Please try again later.",
			},
			500,
		);
	}
};
