import { serve } from "@hono/node-server";
import * as dotenv from "dotenv";
import { Hono } from "hono";
import { cors } from "hono/cors";
import { validateDatabaseConnection } from "./db";
import { authMiddleware } from "./middleware/auth.middleware";
import { errorHandler } from "./middleware/error.middleware";
import { logger } from "./middleware/logging.middleware";
import auth from "./routes/auth/auth.controller";
import jobs from "./routes/jobs/jobs.controller";

dotenv.config();

const app = new Hono();

// CORS configuration
app.use(
	"*",
	cors({
		origin: process.env.CORS_ORIGIN?.split(",") || ["http://localhost:3000"],
		allowMethods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
		allowHeaders: ["Content-Type", "Authorization"],
		exposeHeaders: ["Content-Length"],
		maxAge: 600,
		credentials: true,
	}),
);

app.use("*", logger);
app.use("*", errorHandler);

app.route("/auth", auth);
app.route("/jobs", jobs);

app.get("/me", authMiddleware, (c) => {
	const payload = c.get("jwtPayload");
	return c.json({ user: payload });
});

app.get("/health", (c) => {
	return c.json({
		status: "ok",
		message: "Server is healthy and running",
	});
});

const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

// Graceful shutdown handling
let server: ReturnType<typeof serve>;

async function startServer() {
	try {
		// Validate database connection before starting server
		// await validateDatabaseConnection();

		server = serve(
			{
				fetch: app.fetch,
				port: PORT,
			},
			() => {
				console.log("\n=================================");
				console.log("🚀 Server is running!");
				console.log(`📍 URL: http://localhost:${PORT}`);
				console.log(`💚 Health: http://localhost:${PORT}/health`);
				console.log("=================================\n");
			},
		);
	} catch (error) {
		console.error("Failed to start server:", error);
		process.exit(1);
	}
}

// Handle graceful shutdown
async function gracefulShutdown(signal: string) {
	console.log(`\n${signal} received. Starting graceful shutdown...`);

	if (server) {
		server.close(() => {
			console.log("HTTP server closed");
		});
	}

	// Close database connection
	const { db } = await import("./db");
	try {
		await db.destroy();
		console.log("Database connection closed");
	} catch (error) {
		console.error("Error closing database connection:", error);
	}

	process.exit(0);
}

// Register shutdown handlers
process.on("SIGTERM", () => gracefulShutdown("SIGTERM"));
process.on("SIGINT", () => gracefulShutdown("SIGINT"));

// Start the server
startServer();

export default app;
