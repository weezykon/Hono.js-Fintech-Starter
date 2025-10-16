import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { emailQueue } from "../../queues/email.queue";
import { sendEmailSchema } from "./zod";

const jobs = new Hono();

jobs.post("/send-email", zValidator("json", sendEmailSchema), async (c) => {
	const { email } = c.req.valid("json");

	await emailQueue.add("send-email-job", { email });

	return c.json({ message: "Email job added to the queue" });
});

export default jobs;
