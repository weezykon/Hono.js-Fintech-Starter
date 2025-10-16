import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import {
	comparePasswords,
	createToken,
	createUser,
	getUserByEmail,
	hashPassword,
} from "./auth.service";
import { loginSchema, registerSchema } from "./zod";

const auth = new Hono();

auth.post("/register", zValidator("json", registerSchema), async (c) => {
	const { email, password } = c.req.valid("json");
	const hashedPassword = await hashPassword(password);

	try {
		const user = await createUser({ email, password: hashedPassword });
		const token = await createToken({ id: user.id, email: user.email });

		return c.json({ token });
	} catch (error) {
		if (error instanceof Error && error.message.includes("duplicate key")) {
			return c.json({ error: "User already exists" }, 400);
		}
		return c.json({ error: "Failed to register user" }, 500);
	}
});

auth.post("/login", zValidator("json", loginSchema), async (c) => {
	const { email, password } = c.req.valid("json");

	try {
		const user = await getUserByEmail(email);

		if (!user) {
			return c.json({ error: "Invalid credentials" }, 401);
		}

		const passwordMatch = await comparePasswords(password, user.password);

		if (!passwordMatch) {
			return c.json({ error: "Invalid credentials" }, 401);
		}

		const token = await createToken({ id: user.id, email: user.email });

		return c.json({ token });
	} catch (error) {
		return c.json({ error: "Failed to login" }, 500);
	}
});

export default auth;
