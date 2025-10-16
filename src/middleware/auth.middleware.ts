import * as dotenv from "dotenv";
import { jwt } from "hono/jwt";

// Ensure environment variables are loaded
dotenv.config();

const jwtSecret = process.env.JWT_SECRET;

if (!jwtSecret) {
	throw new Error("JWT_SECRET environment variable is required");
}

export const authMiddleware = jwt({
	secret: jwtSecret,
});
