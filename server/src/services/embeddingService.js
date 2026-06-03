const { pipeline } = require('@xenova/transformers');

const MODEL_NAME = 'Xenova/all-MiniLM-L6-v2';
let embeddingPipelinePromise = null;

function getEmbeddingPipeline() {
	if (!embeddingPipelinePromise) {
		embeddingPipelinePromise = pipeline('feature-extraction', MODEL_NAME);
	}

	return embeddingPipelinePromise;
}

async function getEmbedding(text) {
	const extractor = await getEmbeddingPipeline();
	const result = await extractor(text.slice(0, 8000), {
		pooling: 'mean',
		normalize: true,
	});

	if (Array.isArray(result)) {
		return Array.isArray(result[0]) ? result[0] : result;
	}

	if (typeof result.tolist === 'function') {
		const values = result.tolist();
		return Array.isArray(values[0]) ? values[0] : values;
	}

	if (result.data) {
		return Array.from(result.data);
	}

	return [];
}

function cosineSimilarity(vecA, vecB) {
	let dotProduct = 0;
	let magnitudeA = 0;
	let magnitudeB = 0;

	for (let index = 0; index < vecA.length; index += 1) {
		dotProduct += vecA[index] * vecB[index];
		magnitudeA += vecA[index] * vecA[index];
		magnitudeB += vecB[index] * vecB[index];
	}

	const denominator = Math.sqrt(magnitudeA) * Math.sqrt(magnitudeB);

	if (denominator === 0) {
		return 0;
	}

	return dotProduct / denominator;
}

async function similarityScore(textA, textB) {
	const [embeddingA, embeddingB] = await Promise.all([
		getEmbedding(textA),
		getEmbedding(textB),
	]);

	return Math.round(cosineSimilarity(embeddingA, embeddingB) * 100);
}

module.exports = { similarityScore };