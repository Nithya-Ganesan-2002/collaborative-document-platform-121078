const jwt = require('jsonwebtoken');

/**
 * Signs a new JWT for the given payload.
 * @param {object} payload 
 * @returns {string} JWT
 */
// PUBLIC_INTERFACE
function signToken(payload) {
  /** Issue a JWT for given payload with SECRET from env */
  const secret = process.env.JWT_SECRET;
  if (!secret) throw new Error('Missing JWT_SECRET');
  return jwt.sign(payload, secret, { expiresIn: '6h' });
}

/**
 * Verifies an incoming JWT
 * @param {string} token 
 * @returns {object} Decoded payload
 */
// PUBLIC_INTERFACE
function verifyToken(token) {
  /** Verifies a JWT and returns the decoded payload */
  const secret = process.env.JWT_SECRET;
  if (!secret) throw new Error('Missing JWT_SECRET');
  return jwt.verify(token, secret);
}

module.exports = { signToken, verifyToken };
