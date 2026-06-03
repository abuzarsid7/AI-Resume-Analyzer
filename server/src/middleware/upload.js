const multer = require('multer');
const { MAX_FILE_SIZE, MAX_FILES } = require('../config');

const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
	const allowedTypes = [
		'application/pdf',
		'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
	];

	if (!allowedTypes.includes(file.mimetype)) {
		return cb(new Error('Only PDF and DOCX allowed'), false);
	}

	cb(null, true);
};

module.exports = multer({
	storage,
	limits: {
		fileSize: MAX_FILE_SIZE,
		files: MAX_FILES
	},
	fileFilter
});
