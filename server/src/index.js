const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 5050;

app.use(cors());
app.use(express.json());

app.get('/health', (req, res) => {
	res.status(200).json({ status: 'ok' });
});

app.get('/', (req, res) => {
	res.json({ message: 'AI Resume Analyzer server is running' });
});

app.listen(port, () => {
	console.log(`Server running on port ${port}`);
});
