import { z } from "zod";

// Password validation: at least 8 characters, must include uppercase, lowercase, number, and special character
const passwordSchema = z
	.string()
	.min(8, "Password must be at least 8 characters long")
	.regex(/[a-z]/, "Password must contain at least one lowercase letter")
	.regex(/[A-Z]/, "Password must contain at least one uppercase letter")
	.regex(/[0-9]/, "Password must contain at least one number")
	.regex(
		/[^a-zA-Z0-9]/,
		"Password must contain at least one special character",
	);

export const registerSchema = z.object({
	email: z.string().email("Invalid email address"),
	password: passwordSchema,
});

export const loginSchema = z.object({
	email: z.string().email("Invalid email address"),
	password: z.string().min(1, "Password is required"),
});
