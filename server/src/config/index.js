const PORT = process.env.PORT || 5050;
const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret';
const MAX_FILE_SIZE = 10 * 1024 * 1024;
const MAX_FILES = 1;
const OPENAI_API_KEY = process.env.OPENAI_API_KEY || '';
const GROQ_API_KEY = process.env.GROQ_API_KEY || process.env.OPENAI_API_KEY || '';
const GROQ_BASE_URL = process.env.GROQ_BASE_URL || 'https://api.groq.com/openai/v1';

module.exports = { PORT, JWT_SECRET, MAX_FILE_SIZE, MAX_FILES, OPENAI_API_KEY, GROQ_API_KEY, GROQ_BASE_URL };
