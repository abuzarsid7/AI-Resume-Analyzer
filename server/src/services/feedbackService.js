const Groq = require('groq-sdk');
const { GROQ_API_KEY } = require('../config');

const groq = GROQ_API_KEY ? new Groq({ apiKey: GROQ_API_KEY }) : null;

const FALLBACK_FEEDBACK = {
	strengths: [],
	improvements: [],
	summary: 'Analysis unavailable',
};

async function generateFeedback(resumeText, jobDescription, scores) {
	try {
		if (!groq) {
			return FALLBACK_FEEDBACK;
		}

		const response = await groq.chat.completions.create({
			model: 'llama-3.3-70b-versatile',
			messages: [
				{
					role: 'system',
					content:
						'You analyze resumes against job descriptions. Return ONLY valid JSON. No markdown, no code blocks, no explanation.',
				},
				{
					role: 'user',
					content: `Generate concise feedback using this JSON shape exactly: { strengths: string[], improvements: string[], summary: string }. Each array should contain 2-3 items only.\n\nScores: ${JSON.stringify(scores)}\n\nResume text: ${resumeText.slice(0, 2500)}\n\nJob description: ${jobDescription.slice(0, 800)}`,
				},
			],
		});

		const content = response.choices?.[0]?.message?.content || '{}';
		return JSON.parse(content);
	} catch (error) {
		return FALLBACK_FEEDBACK;
	}
}

module.exports = { generateFeedback };
