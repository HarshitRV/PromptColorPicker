import { randomUUID } from "crypto";
import rateLimit from "../utils/rate-limit";

const limiter = rateLimit({
	interval: 5000, // 1minute
	uniqueTokenPerInterval: 100, // 100 users per second
});

export default async function handler(req, res) {
	try {
		await limiter.check(res, 3 + 1, process.env.CACHE_TOKEN); // 3 requests per minute
		res.status(200).json({ id: randomUUID() });
	} catch (e) {
		res.status(429).json({ error: "Rate limit exceeded" });
	}
}
