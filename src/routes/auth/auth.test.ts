import { describe, expect, it } from "vitest";
import app from "../../index";

describe("Auth Routes", () => {
	const testEmail = `test-${Date.now()}@example.com`;
	const testPassword = "TestPass123!";
	let authToken: string;

	describe("POST /auth/register", () => {
		it("should register a new user with valid credentials", async () => {
			const res = await app.request("/auth/register", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					email: testEmail,
					password: testPassword,
				}),
			});

			expect(res.status).toBe(200);
			const data = await res.json();
			expect(data).toHaveProperty("token");
			expect(typeof data.token).toBe("string");
			authToken = data.token;
		});

		it("should reject registration with weak password", async () => {
			const res = await app.request("/auth/register", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					email: "another@example.com",
					password: "weak",
				}),
			});

			expect(res.status).toBe(400);
		});

		it("should reject registration with invalid email", async () => {
			const res = await app.request("/auth/register", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					email: "invalid-email",
					password: testPassword,
				}),
			});

			expect(res.status).toBe(400);
		});

		it("should reject duplicate email registration", async () => {
			const res = await app.request("/auth/register", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					email: testEmail,
					password: testPassword,
				}),
			});

			expect(res.status).toBe(400);
			const data = await res.json();
			expect(data.error).toBe("User already exists");
		});
	});

	describe("POST /auth/login", () => {
		it("should login with valid credentials", async () => {
			const res = await app.request("/auth/login", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					email: testEmail,
					password: testPassword,
				}),
			});

			expect(res.status).toBe(200);
			const data = await res.json();
			expect(data).toHaveProperty("token");
			expect(typeof data.token).toBe("string");
		});

		it("should reject login with wrong password", async () => {
			const res = await app.request("/auth/login", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					email: testEmail,
					password: "WrongPass123!",
				}),
			});

			expect(res.status).toBe(401);
			const data = await res.json();
			expect(data.error).toBe("Invalid credentials");
		});

		it("should reject login with non-existent email", async () => {
			const res = await app.request("/auth/login", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					email: "nonexistent@example.com",
					password: testPassword,
				}),
			});

			expect(res.status).toBe(401);
			const data = await res.json();
			expect(data.error).toBe("Invalid credentials");
		});

		it("should reject login with invalid email format", async () => {
			const res = await app.request("/auth/login", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					email: "invalid-email",
					password: testPassword,
				}),
			});

			expect(res.status).toBe(400);
		});
	});

	describe("GET /me", () => {
		it("should return user data with valid token", async () => {
			const res = await app.request("/me", {
				method: "GET",
				headers: {
					Authorization: `Bearer ${authToken}`,
				},
			});

			expect(res.status).toBe(200);
			const data = await res.json();
			expect(data).toHaveProperty("user");
			expect(data.user).toHaveProperty("email");
			expect(data.user.email).toBe(testEmail);
		});

		it("should reject request without token", async () => {
			const res = await app.request("/me", {
				method: "GET",
			});

			expect(res.status).toBe(401);
		});

		it("should reject request with invalid token", async () => {
			const res = await app.request("/me", {
				method: "GET",
				headers: {
					Authorization: "Bearer invalid-token",
				},
			});

			expect(res.status).toBe(401);
		});
	});
});
