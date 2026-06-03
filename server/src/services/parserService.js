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
						'You are a resume parser. Return ONLY a JSON object and nothing else. Do not use markdown, code fences, or explanations.',
				},
				{
					role: 'user',
					content: `Parse the resume text into this JSON schema exactly: { "name": "string", "email": "string", "skills": ["string"], "experience": ["string"], "education": ["string"] }. Return only valid JSON. Resume text:\n\n${text.slice(0, 4000)}`,
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
