/**
 * Controller for document CRUD operations (scaffold)
 */
class DocumentController {
  /**
   * List all documents for authenticated user
   */
  // PUBLIC_INTERFACE
  async list(req, res) {
    // TODO: List documents for req.user.sub
    res.status(200).json({ documents: [] });
  }

  /**
   * Get a document by ID
   */
  // PUBLIC_INTERFACE
  async get(req, res) {
    // TODO: Fetch a document for req.user.sub
    res.status(200).json({ document: null });
  }

  /**
   * Create a new document
   */
  // PUBLIC_INTERFACE
  async create(req, res) {
    // TODO: Create a new document for req.user.sub
    res.status(201).json({ document: null });
  }

  /**
   * Update an existing document
   */
  // PUBLIC_INTERFACE
  async update(req, res) {
    // TODO: Update document by ID for req.user.sub
    res.status(200).json({ updated: true });
  }

  /**
   * Delete a document
   */
  // PUBLIC_INTERFACE
  async delete(req, res) {
    // TODO: Delete document by ID for req.user.sub
    res.status(204).send();
  }
}

module.exports = new DocumentController();
