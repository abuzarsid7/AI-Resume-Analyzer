const { similarityScore } = require('./embeddingService');

const WEIGHTS = {
	skills: 0.4,
	experience: 0.4,
	education: 0.2,
};

async function scoreSections(structured, jobDescription) {
	const sectionTexts = {
		skills: Array.isArray(structured?.skills) && structured.skills.length > 0 ? structured.skills.join(' ') : '',
		experience:
			Array.isArray(structured?.experience) && structured.experience.length > 0
				? structured.experience.join(' ')
				: '',
		education:
			Array.isArray(structured?.education) && structured.education.length > 0
				? structured.education.join(' ')
				: '',
	};

	const [skills, experience, education] = await Promise.all([
		sectionTexts.skills ? similarityScore(sectionTexts.skills, jobDescription) : 0,
		sectionTexts.experience ? similarityScore(sectionTexts.experience, jobDescription) : 0,
		sectionTexts.education ? similarityScore(sectionTexts.education, jobDescription) : 0,
	]);

	const total = Math.round(
		skills * WEIGHTS.skills + experience * WEIGHTS.experience + education * WEIGHTS.education,
	);

	return { skills, experience, education, total };
}

module.exports = { scoreSections, WEIGHTS };
