const OpenAI = require('openai');
const { GROQ_API_KEY, GROQ_BASE_URL } = require('../config');

const groq = GROQ_API_KEY ? new OpenAI({ apiKey: GROQ_API_KEY, baseURL: GROQ_BASE_URL }) : null;

const FALLBACK_FEEDBACK = {
	strengths: [],
	improvements: [],
	comparison: { skills: '', experience: '' },
	summary: 'Analysis unavailable',
};

async function generateFeedback(resumeText, jobDescription, scores) {
	try {
		if (!groq) {
			return FALLBACK_FEEDBACK;
		}

		const response = await groq.chat.completions.create({
			model: 'llama-3.3-70b-versatile',
			response_format: { type: 'json_object' },
			messages: [
				{
					role: 'system',
					content:
						'You analyze resumes against job descriptions. Return ONLY valid JSON. No markdown, no code blocks, no explanation.',
				},
				{
					role: 'user',
					content: `Generate concise feedback using this JSON shape exactly: { "strengths": ["string"], "improvements": ["string"], "summary": "string", "comparison": { "skills": "string", "experience": "string" } }. Each array should contain 2-3 items only. For comparison, write 1-2 short sentences comparing the resume vs job description for both skills and experience.\n\nScores: ${JSON.stringify(scores)}\n\nResume text: ${resumeText.slice(0, 2500)}\n\nJob description: ${jobDescription.slice(0, 800)}`,
				},
			],
		});

		let content = response.choices?.[0]?.message?.content || '{}';
		content = content.replace(/```json/g, '').replace(/```/g, '').trim();
		return JSON.parse(content);
	} catch (error) {
		console.error('[Feedback Error]', error.message);
		return FALLBACK_FEEDBACK;
	}
}

module.exports = { generateFeedback };
