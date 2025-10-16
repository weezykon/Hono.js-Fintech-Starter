import { Queue, Worker } from "bullmq";
import * as dotenv from "dotenv";

dotenv.config();

const connection = {
	host: process.env.REDIS_HOST || "localhost",
	port: parseInt(process.env.REDIS_PORT || "6379", 10),
};

export const emailQueue = new Queue("email-queue", { connection });

new Worker(
	"email-queue",
	async (job) => {
		console.log(`Sending email to ${job.data.email}`);
		// Simulate sending email
		await new Promise((resolve) => setTimeout(resolve, 1000));
		console.log(`Email sent to ${job.data.email}`);
	},
	{ connection },
);
