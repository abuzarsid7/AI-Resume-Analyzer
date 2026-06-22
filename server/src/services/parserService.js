const OpenAI = require('openai');
const pdfParse = require('pdf-parse');
const mammoth = require('mammoth');
const { GROQ_API_KEY, GROQ_BASE_URL } = require('../config');

const llm = GROQ_API_KEY
	? new OpenAI({
		apiKey: GROQ_API_KEY,
		baseURL: GROQ_BASE_URL,
	})
	: null;

const client = {
	messages: {
		create: async ({ model, max_tokens, messages }) => {
			const completion = await llm.chat.completions.create({
				model,
				max_tokens,
				messages,
			});

			return {
				content: [
					{
						text: completion.choices?.[0]?.message?.content || '',
					},
				],
			};
		},
	},
};

const FALLBACK_STRUCTURED_DATA = {
	name: '',
	email: '',
	skills: [],
	experience: [],
	education: [],
};

async function extractText(file) {
	let text = '';

	if (file.mimetype === 'application/pdf') {
		const data = await pdfParse(file.buffer);
		text = data.text;
	} else if (
		file.mimetype === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
	) {
		const result = await mammoth.extractRawText({ buffer: file.buffer });
		text = result.value;
	} else {
		throw new Error('Unsupported file type');
	}

	text = text.trim();
	console.log('[Parsed]', text.slice(0, 200));

	return text;
}

async function extractStructured(text) {
	try {
		if (!llm) {
			return FALLBACK_STRUCTURED_DATA;
		}

		const response = await llm.chat.completions.create({
			model: 'llama-3.3-70b-versatile',
			max_tokens: 1000,
			response_format: { type: 'json_object' },
			messages: [
				{
					role: 'system',
					content:
						'You are an expert resume parser. Return ONLY a valid JSON object and nothing else. Do not use markdown formatting or code blocks. Prioritize accurately extracting the candidate\'s full name and email address.',
				},
				{
					role: 'user',
					content: `Extract the following information from the resume text into a JSON object exactly matching this schema:
{
  "name": "Candidate's full name (usually found at the top)",
  "email": "Candidate's email address",
  "skills": ["List of skills"],
  "experience": ["List of work experience"],
  "education": ["List of education"]
}

If any field is not found, leave it as an empty string or empty array. Return ONLY valid JSON.

Resume text:
${text.slice(0, 8000)}`,
				},
			],
		});

		let content = response.choices?.[0]?.message?.content || '{}';
		content = content.replace(/```json/g, '').replace(/```/g, '').trim();
		return JSON.parse(content);
	} catch (error) {
		console.error('[Parser Error]', error.message);
		return FALLBACK_STRUCTURED_DATA;
	}
}

module.exports = { extractText, extractStructured };
