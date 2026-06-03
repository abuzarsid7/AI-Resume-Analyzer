const PORT = process.env.PORT || 5050;
const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret';
const MAX_FILE_SIZE = 10 * 1024 * 1024;
const MAX_FILES = 1;

module.exports = { PORT, JWT_SECRET, MAX_FILE_SIZE, MAX_FILES };
