const { verifyToken } = require('../services/jwt');

/**
 * Express middleware to protect routes by verifying JWT token.
 */
// PUBLIC_INTERFACE
function authenticateJWT(req, res, next) {
  /** 
   * Authenticates JWT from Authorization header. Sets req.user if valid.
   * Responds 401 if missing or invalid.
   */
  const authHeader = req.headers['authorization'];
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Missing or malformed Authorization header.' });
  }
  const token = authHeader.split(' ')[1];
  try {
    const decoded = verifyToken(token);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Invalid or expired token.' });
  }
}

module.exports = { authenticateJWT };
