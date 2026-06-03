const { extractText, extractStructured } = require('../services/parserService');

exports.analyzeResumes = async (req, res, next) => {
	try {
		const files = req.files || [];
		const analyzedResumes = [];

		for (const file of files) {
			const text = await extractText(file);
			const structured = await extractStructured(text);

			analyzedResumes.push({
				filename: file.originalname,
				text,
				structured,
			});
		}

		return res.json({
			count: analyzedResumes.length,
			resumes: analyzedResumes,
		});
	} catch (error) {
		return next(error);
	}
};
