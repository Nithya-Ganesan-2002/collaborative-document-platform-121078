const supabase = require('../services/supabase');
const { signToken } = require('../services/jwt');

/**
 * Controller for user authentication
 */
class AuthController {
  /**
   * Registers a new user
   */
  // PUBLIC_INTERFACE
  async register(req, res) {
    /**
     * Registers a new user using email and password with Supabase as user DB.
     * Body: { email, password }
     * Returns user info and JWT if successful.
     */
    try {
      const { email, password } = req.body;
      if (!email || !password || typeof password !== 'string') {
        return res.status(400).json({ error: 'Email and password are required.' });
      }
      const { data, error } = await supabase.auth.signUp({ email, password });
      if (error) {
        return res.status(400).json({ error: error.message });
      }
      const user = data.user || data;
      const token = signToken({ sub: user.id, email: user.email });
      return res.status(201).json({ user: { id: user.id, email: user.email }, token });
    } catch (err) {
      console.error('Register error:', err);
      return res.status(500).json({ error: 'Server error during registration.' });
    }
  }

  /**
   * Logs in an existing user
   */
  // PUBLIC_INTERFACE
  async login(req, res) {
    /**
     * Logs in a user using Supabase auth and returns a JWT.
     * Body: { email, password }
     */
    try {
      const { email, password } = req.body;
      if (!email || !password || typeof password !== 'string') {
        return res.status(400).json({ error: 'Email and password are required.' });
      }
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) {
        return res.status(401).json({ error: 'Invalid email or password.' });
      }
      const user = data.user || data;
      const token = signToken({ sub: user.id, email: user.email });
      return res.status(200).json({ user: { id: user.id, email: user.email }, token });
    } catch (err) {
      console.error('Login error:', err);
      return res.status(500).json({ error: 'Server error during login.' });
    }
  }
}

module.exports = new AuthController();
