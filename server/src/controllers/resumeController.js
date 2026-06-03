const { extractText, extractStructured } = require('../services/parserService');
const { scoreSections } = require('../services/scoringService');
const { getCached, setCached } = require('../utils/cache');

exports.analyzeResumes = async (req, res, next) => {
	try {
		const files = req.files || [];
		const analyzedResumes = [];
		const jobDescription = req.body?.jobDescription || '';

		for (const file of files) {
			const cacheKey = `${file.originalname}:${jobDescription.slice(0, 50)}`;
			const cachedResult = getCached(cacheKey);

			if (cachedResult) {
				analyzedResumes.push(cachedResult);
				continue;
			}

			const text = await extractText(file);
			const structured = await extractStructured(text);
			const scores = await scoreSections(structured, jobDescription);

			const analyzedResume = {
				filename: file.originalname,
				text,
				structured,
				scores,
			};

			setCached(cacheKey, analyzedResume);
			analyzedResumes.push(analyzedResume);
		}

		return res.json({
			count: analyzedResumes.length,
			resumes: analyzedResumes,
		});
	} catch (error) {
		return next(error);
	}
};
