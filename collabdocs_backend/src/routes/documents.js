const express = require('express');
const documentController = require('../controllers/document');
const { authenticateJWT } = require('../middleware/auth');

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Documents
 *   description: Document management endpoints
 */

/**
 * @swagger
 * /api/docs:
 *   get:
 *     summary: List documents for user
 *     tags: [Documents]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of user's documents
 */
router.get('/', authenticateJWT, documentController.list);

/**
 * @swagger
 * /api/docs/{id}:
 *   get:
 *     summary: Get a document by ID
 *     tags: [Documents]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Document data
 */
router.get('/:id', authenticateJWT, documentController.get);

/**
 * @swagger
 * /api/docs:
 *   post:
 *     summary: Create a new document
 *     tags: [Documents]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [title]
 *             properties:
 *               title:
 *                 type: string
 *               content:
 *                 type: string
 *     responses:
 *       201:
 *         description: Created
 */
router.post('/', authenticateJWT, documentController.create);


/**
 * @swagger
 * /api/docs/{id}:
 *   put:
 *     summary: Update a document
 *     tags: [Documents]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title: { type: string }
 *               content: { type: string }
 *     responses:
 *       200:
 *         description: Updated
 */
router.put('/:id', authenticateJWT, documentController.update);

/**
 * @swagger
 * /api/docs/{id}:
 *   delete:
 *     summary: Delete a document
 *     tags: [Documents]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       204:
 *         description: Deleted
 */
router.delete('/:id', authenticateJWT, documentController.delete);

module.exports = router;
