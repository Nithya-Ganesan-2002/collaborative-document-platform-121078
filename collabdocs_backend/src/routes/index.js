const express = require('express');
const healthController = require('../controllers/health');

const authRoutes = require('./auth');
const documentRoutes = require('./documents');

const router = express.Router();

// Health endpoint (root)
router.get('/', healthController.check.bind(healthController));

// Auth endpoints
router.use('/api/auth', authRoutes);

// Document CRUD endpoints, protected with JWT
router.use('/api/docs', documentRoutes);

module.exports = router;
