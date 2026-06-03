const NodeCache = require('node-cache');

const cache = new NodeCache({ stdTTL: 3600, checkperiod: 600 });

function getCached(key) {
	return cache.get(key) || null;
}

function setCached(key, value) {
	cache.set(key, value);
}

module.exports = { getCached, setCached };
