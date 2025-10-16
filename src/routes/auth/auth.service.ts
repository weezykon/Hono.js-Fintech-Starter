import * as bcrypt from "bcryptjs";
import { sign } from "hono/jwt";
import { db } from "../../db";
import type { User } from "../../db/types";

export const hashPassword = async (password: string) => {
	const salt = await bcrypt.genSalt(10);
	return bcrypt.hash(password, salt);
};

export const comparePasswords = async (password: string, hash: string) => {
	return bcrypt.compare(password, hash);
};

export const createToken = async (payload: { id: number; email: string }) => {
	const secret = process.env.JWT_SECRET;
	if (!secret) {
		throw new Error("JWT_SECRET is not set in the environment variables");
	}
	return sign(payload, secret);
};

export const createUser = async (user: Omit<User, "id" | "created_at">) => {
	return db
		.insertInto("users")
		.values(user)
		.returning(["id", "email"])
		.executeTakeFirstOrThrow();
};

export const getUserByEmail = async (email: string) => {
	return db
		.selectFrom("users")
		.selectAll()
		.where("email", "=", email)
		.executeTakeFirst();
};
