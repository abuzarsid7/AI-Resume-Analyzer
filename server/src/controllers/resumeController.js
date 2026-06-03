const { extractText, extractStructured } = require('../services/parserService');
const { scoreSections } = require('../services/scoringService');
const { generateFeedback } = require('../services/feedbackService');
const { getCached, setCached } = require('../utils/cache');

exports.analyzeResumes = async (req, res, next) => {
	try {
		const jobDescription = req.body?.jobDescription;
		const files = req.files || [];

		if (!jobDescription) {
			return res.status(400).json({ error: 'Job description required' });
		}

		if (!files || files.length === 0) {
			return res.status(400).json({ error: 'At least one resume file is required' });
		}

		const rankedResults = await Promise.all(
			files.map(async (file) => {
				const cacheKey = `${file.originalname}:${jobDescription.slice(0, 50)}`;
				const cachedResult = getCached(cacheKey);

				if (cachedResult) {
					return cachedResult;
				}

				const text = await extractText(file);
				const structured = await extractStructured(text);
				const scores = await scoreSections(structured, jobDescription);
				const feedback = await generateFeedback(text, jobDescription, scores);

				const analyzedResume = {
					name: structured.name || '',
					email: structured.email || '',
					filename: file.originalname,
					scores,
					feedback,
				};

				setCached(cacheKey, analyzedResume);
				return analyzedResume;
			}),
		);

		return res.json({
			candidates: rankedResults.sort((a, b) => b.scores.total - a.scores.total),
			count: rankedResults.length,
		});
	} catch (error) {
		next(error);
	}
};
