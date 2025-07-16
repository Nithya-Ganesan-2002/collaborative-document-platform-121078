// Export all application middlewares here
const { authenticateJWT } = require('./auth');

module.exports = {
  authenticateJWT,
  // Add your middleware here
};
