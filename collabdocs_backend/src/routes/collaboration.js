const express = require('express');
const { authenticateJWT } = require('../middleware/auth');
const documentController = require('../controllers/document');

/**
 * Collaboration (real-time) endpoints
 * Stubs for WebSocket and/or Supabase Realtime for phase 1
 */

const router = express.Router();

/**
 * @swagger
 * /api/collaboration/realtime:
 *   get:
 *     summary: Real-time collaboration WebSocket/scaffold endpoint
 *     description: |
 *       Upgradable to WebSocket. Use for document collaboration - see documentation.
 *       For now, responds with stub message.
 *     security:
 *       - bearerAuth: []
 *     tags: [Collaboration]
 *     responses:
 *       501:
 *         description: Real-time collaboration endpoint not yet implemented
 */
router.get('/realtime', authenticateJWT, documentController.realtimeStub);

module.exports = router;
