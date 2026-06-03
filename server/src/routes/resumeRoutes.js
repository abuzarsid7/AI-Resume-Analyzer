const express = require('express');
const authMiddleware = require('../middleware/authMiddleware');
const upload = require('../middleware/upload');
const resumeController = require('../controllers/resumeController');

const router = express.Router();

router.post('/analyze', authMiddleware, upload.array('resumes', 10), resumeController.analyzeResumes);

module.exports = router;
