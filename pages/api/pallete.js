import { validateAndParseHexCodeArray } from "./utils";
import OpenAI from "openai";
import rateLimit from "../utils/rate-limit";

const limiter = rateLimit({
	interval: 1 * 60 * 1000, // 10 seconds
	uniqueTokenPerInterval: 50, // 50 users per second
});

const openai = new OpenAI({
	apiKey: process.env.OPENAI_API_KEY,
});

const getGPTSuggestion = async (prompt) => {
	try {
		const response = await openai.chat.completions.create({
			model: "gpt-3.5-turbo",
			messages: [
				{
					role: "system",
					content: process.env.PROMPT.trim(),
				},
				{ role: "user", content: `PROMPT: ${prompt}` },
			],
			temperature: 0.3,
			max_tokens: 400,
			top_p: 1,
			frequency_penalty: 0,
			presence_penalty: 0,
		});

		return response.choices[0].message.content;
	} catch (e) {
		console.error("OPEN_AI_ERROR", e);
	}
};

const getColorPallete = () => {
	console.log("getColorPallete");
	const colors = [
		"#CDFAD5",
		"#F6FDC3",
		"#FFCF96",
		"#FF8080",
		"#B6FFFA",
		"#98E4FF",
		"#80B3FF",
		"#008170",
		"#F5E8B7",
		"#6A9C89",
	];

	let numPicks = 4;
	const picks = [];

	const colorPicker = (numPicks) => {
		if (numPicks === 0) return;
		const pickedIndex = Math.floor(Math.random() * colors.length);
		if (!picks.includes(colors[pickedIndex])) {
			picks.push(colors[pickedIndex]);
			colorPicker(numPicks - 1);
		} else {
			colorPicker(numPicks);
		}
	};

	colorPicker(numPicks);
	console.log(picks);
	return picks;
};

export default async function handler(req, res) {
	try {
		if (req.method === "POST") {
			await limiter.check(res, 3 + 1, process.env.CACHE_TOKEN); // 3 requests per minute
			const { input } = JSON.parse(req.body);

			if (!input) {
				return res
					.status(400)
					.json({ success: false, error: "No input provided" });
			}

			if (input.length > 50) {
				return res
					.status(400)
					.json({ success: false, error: "Input too long" });
			}

			const gptResponse = await getGPTSuggestion(input);

			const formattedResponse = validateAndParseHexCodeArray(gptResponse);

			console.log("formattedResponse", formattedResponse);

			return res
				.status(200)
				.json({ success: true, pallete: formattedResponse });
		}
	} catch (e) {
		console.error("Pallete Handler error", e);
		console.log("Body", req.body);
		return res.status(429).json({
			success: false,
			error: "Only 3 requests per minute allowed",
			pallete: getColorPallete(),
		});
	}
}
