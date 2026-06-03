const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const path = require('path');
require('dotenv').config();

const { PORT } = require('./config');
const authRoutes = require('./routes/authRoutes');
const resumeRoutes = require('./routes/resumeRoutes');
const errorHandler = require('./middleware/errorHandler');

const app = express();

app.use(helmet());
app.use(cors({ origin: 'http://localhost:5173', credentials: true }));
app.use(morgan('dev'));
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use('/api/auth', authRoutes);
app.use('/api/resume', resumeRoutes);

app.get('/health', (req, res) => {
	res.status(200).json({ status: 'ok' });
});

app.get('/', (req, res) => {
	res.json({ message: 'AI Resume Analyzer server is running' });
});

app.use(errorHandler);

app.listen(PORT, () => {
	console.log(`Server on ${PORT}`);
});
