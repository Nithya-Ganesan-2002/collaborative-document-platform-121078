/**
 * Controller for document CRUD operations and (scaffolded) real-time collaboration API.
 * - Enforces document access controls (may own or be shared with user)
 */
const documentService = require('../services/document');

class DocumentController {
  /**
   * List all documents for authenticated user
   * Returns docs either owned by or shared with the user.
   */
  // PUBLIC_INTERFACE
  async list(req, res) {
    try {
      const userId = req.user.sub;
      const docs = await documentService.listDocuments(userId);
      res.status(200).json({ documents: docs });
    } catch (err) {
      console.error('List documents error:', err);
      res.status(500).json({ error: 'Could not list documents' });
    }
  }

  /**
   * Get a document by ID
   * User must own or have share on the document.
   */
  // PUBLIC_INTERFACE
  async get(req, res) {
    try {
      const userId = req.user.sub;
      const docId = req.params.id;
      const doc = await documentService.getDocument(docId, userId);
      if (!doc) return res.status(404).json({ error: 'Document not found' });
      res.status(200).json({ document: doc });
    } catch (err) {
      if (err.status === 403) return res.status(403).json({ error: err.message });
      res.status(500).json({ error: 'Could not fetch document' });
    }
  }

  /**
   * Create a new document
   * Body: { title, content? }
   */
  // PUBLIC_INTERFACE
  async create(req, res) {
    try {
      const userId = req.user.sub;
      const { title, content } = req.body;
      if (!title || typeof title !== 'string') {
        return res.status(400).json({ error: 'A document title is required' });
      }
      const doc = await documentService.createDocument(userId, title, content || '');
      res.status(201).json({ document: doc });
    } catch (err) {
      res.status(500).json({ error: 'Could not create document' });
    }
  }

  /**
   * Update an existing document
   * Body: { title?, content? }
   */
  // PUBLIC_INTERFACE
  async update(req, res) {
    try {
      const userId = req.user.sub;
      const docId = req.params.id;
      const { title, content } = req.body;
      if ((!title || typeof title !== 'string') && (!content || typeof content !== 'string')) {
        return res.status(400).json({ error: 'Nothing to update or invalid data' });
      }
      const updated = await documentService.updateDocument(docId, userId, { title, content });
      if (!updated) return res.status(404).json({ error: 'Document not found or no permission' });
      res.status(200).json({ updated: true });
    } catch (err) {
      if (err.status === 403) return res.status(403).json({ error: err.message });
      res.status(500).json({ error: 'Could not update document' });
    }
  }

  /**
   * Delete a document (only owner)
   */
  // PUBLIC_INTERFACE
  async delete(req, res) {
    try {
      const userId = req.user.sub;
      const docId = req.params.id;
      const deleted = await documentService.deleteDocument(docId, userId);
      if (!deleted) return res.status(404).json({ error: 'Document not found or not permitted' });
      res.status(204).send();
    } catch (err) {
      if (err.status === 403) return res.status(403).json({ error: err.message });
      res.status(500).json({ error: 'Could not delete document' });
    }
  }

  // -- Real-time collaboration stubs (phase 1) --
  // PUBLIC_INTERFACE
  async realtimeStub(req, res) {
    // Placeholder: explains that real-time collab uses WebSocket/Supabase Realtime connection
    res.status(501).json({
      message: 'Real-time collaboration endpoint coming soon. Use websockets on /api/collaboration/realtime (see docs).',
    });
  }
}

module.exports = new DocumentController();
