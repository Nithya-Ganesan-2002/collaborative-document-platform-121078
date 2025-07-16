const supabase = require('./supabase');

/**
 * Service for document CRUD and permission checking using Supabase.
 * 
 * "documents" table fields:
 * - id (uuid, PK)
 * - owner (uuid, user id)
 * - title (string)
 * - content (string)
 * - created_at, updated_at (timestamps)
 * 
 * "documents_shared" table fields:
 * - id (PK)
 * - document_id (uuid, FK)
 * - user_id (uuid)
 * - permission (string: "read" or "write")
 */

// PUBLIC_INTERFACE
async function listDocuments(userId) {
  // All docs user owns or has share to
  // 1. Owned documents
  const { data: owned, error: ownedErr } = await supabase
    .from('documents')
    .select('*')
    .eq('owner', userId);
  if (ownedErr) throw ownedErr;

  // 2. Shared documents
  const { data: sharedLinks, error: sharedErr } = await supabase
    .from('documents_shared')
    .select('document_id')
    .eq('user_id', userId);
  if (sharedErr) throw sharedErr;
  const sharedDocIds = sharedLinks.map(link => link.document_id);

  let sharedDocs = [];
  if (sharedDocIds.length) {
    const { data, error } = await supabase
      .from('documents')
      .select('*')
      .in('id', sharedDocIds);
    if (error) throw error;
    sharedDocs = data;
  }
  // Merge, dedupe
  const merged = [...owned, ...sharedDocs].reduce((acc, doc) => {
    if (!acc.some(d => d.id === doc.id)) acc.push(doc);
    return acc;
  }, []);
  return merged;
}

// Check permission for doc: returns {doc, perm} or null
async function getDocumentPermission(docId, userId) {
  // Try owned
  let { data: owned, error: ownedErr } = await supabase
    .from('documents')
    .select('*')
    .eq('id', docId)
    .eq('owner', userId)
    .maybeSingle();

  if (ownedErr) throw ownedErr;
  if (owned) return { doc: owned, perm: 'owner' };

  // Try shared
  const { data: link, error: shareErr } = await supabase
    .from('documents_shared')
    .select('*,document:documents(*)')
    .eq('document_id', docId)
    .eq('user_id', userId)
    .maybeSingle();
  if (shareErr) throw shareErr;
  if (link && link.document) return { doc: link.document, perm: link.permission };

  return null;
}

// PUBLIC_INTERFACE
async function getDocument(docId, userId) {
  const result = await getDocumentPermission(docId, userId);
  if (!result) return null;
  return result.doc;
}

// PUBLIC_INTERFACE
async function createDocument(userId, title, content = '') {
  const { data, error } = await supabase
    .from('documents')
    .insert([{ title, content, owner: userId }])
    .select('*')
    .maybeSingle();
  if (error) throw error;
  return data;
}

// PUBLIC_INTERFACE
async function updateDocument(docId, userId, { title, content }) {
  // Only owner or user with "write" on shared
  const access = await getDocumentPermission(docId, userId);
  if (!access) throw { status: 404, message: 'No permission or doc not found' };
  if (access.perm !== 'owner' && access.perm !== 'write')
    throw { status: 403, message: 'No permission to update' };

  const fields = {};
  if (typeof title === 'string') fields.title = title;
  if (typeof content === 'string') fields.content = content;
  if (Object.keys(fields).length === 0) return false;

  const { data, error } = await supabase
    .from('documents')
    .update(fields)
    .eq('id', docId)
    .select('*')
    .maybeSingle();
  if (error) throw error;
  return !!data;
}

// PUBLIC_INTERFACE
async function deleteDocument(docId, userId) {
  // Only owner can delete
  let { data: doc, error } = await supabase
    .from('documents')
    .select('*')
    .eq('id', docId)
    .maybeSingle();
  if (error) throw error;
  if (!doc) return false;
  if (doc.owner !== userId) throw { status: 403, message: 'Only owner can delete document' };

  // Delete associated shares first (cleanup)
  await supabase
    .from('documents_shared')
    .delete()
    .eq('document_id', docId);
  // Delete doc
  const { error: delErr } = await supabase
    .from('documents')
    .delete()
    .eq('id', docId);
  if (delErr) throw delErr;
  return true;
}

// -- Future: sharing, permission modification, collab presence, etc --

module.exports = {
  listDocuments,
  getDocument,
  createDocument,
  updateDocument,
  deleteDocument,
};
