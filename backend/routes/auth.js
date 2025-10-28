const express = require('express');
const router = express.Router();
const User = require('../models/user');
const { signAccessToken, signRefreshToken, verifyRefresh } = require('../utils/jwt');
const requireAuth = require('../middleware/requireAuth');

// Cookie options for refresh token
const cookieOpts = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: process.env.NODE_ENV === 'production' ? 'strict' : 'lax',
  path: '/api/auth/refresh',
  maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
};

// Signup
router.post('/signup', async (req, res) => {
  try {
    const { email, password, name } = req.body;
    
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password required' });
    }
    
    // Check if user exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ error: 'Email already registered' });
    }
    
    // Create user
    const user = new User({ email, password, name: name || '' });
    await user.save();
    
    // Generate tokens
    const accessToken = signAccessToken(user);
    const refreshToken = signRefreshToken(user);
    
    // Set refresh token in httpOnly cookie
    res.cookie('jid', refreshToken, cookieOpts);
    
    // Return access token and user info
    res.json({
      accessToken,
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
      },
    });
  } catch (error) {
    console.error('Signup error:', error);
    res.status(500).json({ error: 'Signup failed' });
  }
});

// Login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password required' });
    }
    
    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    
    // Validate password
    const isValid = await user.validatePassword(password);
    if (!isValid) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    
    // Generate tokens
    const accessToken = signAccessToken(user);
    const refreshToken = signRefreshToken(user);
    
    // Set refresh token in httpOnly cookie
    res.cookie('jid', refreshToken, cookieOpts);
    
    // Return access token and user info
    res.json({
      accessToken,
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
      },
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Login failed' });
  }
});

// Refresh access token
router.post('/refresh', async (req, res) => {
  try {
    const token = req.cookies?.jid;
    
    if (!token) {
      return res.status(401).json({ error: 'No refresh token' });
    }
    
    // Verify refresh token
    const payload = verifyRefresh(token);
    
    // Find user
    const user = await User.findById(payload.sub);
    if (!user) {
      return res.status(401).json({ error: 'User not found' });
    }
    
    // Check token version
    if (user.tokenVersion !== payload.tv) {
      return res.status(401).json({ error: 'Token revoked' });
    }
    
    // Generate new tokens
    const accessToken = signAccessToken(user);
    const refreshToken = signRefreshToken(user);
    
    // Set new refresh token in httpOnly cookie
    res.cookie('jid', refreshToken, cookieOpts);
    
    // Return new access token and user info
    res.json({
      accessToken,
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
      },
    });
  } catch (error) {
    console.error('Refresh error:', error);
    res.status(401).json({ error: 'Refresh failed' });
  }
});

// Get current user
router.get('/me', requireAuth, async (req, res) => {
  try {
    const user = await User.findById(req.userId).select('-password -tokenVersion');
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    res.json({
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
      },
    });
  } catch (error) {
    console.error('Me error:', error);
    res.status(500).json({ error: 'Failed to fetch user' });
  }
});

// Logout
router.post('/logout', (req, res) => {
  res.clearCookie('jid', { ...cookieOpts, maxAge: 0 });
  res.json({ success: true });
});

// Revoke all refresh tokens (increment tokenVersion)
router.post('/revoke', requireAuth, async (req, res) => {
  try {
    await User.findByIdAndUpdate(req.userId, { $inc: { tokenVersion: 1 } });
    res.clearCookie('jid', { ...cookieOpts, maxAge: 0 });
    res.json({ success: true });
  } catch (error) {
    console.error('Revoke error:', error);
    res.status(500).json({ error: 'Failed to revoke tokens' });
  }
});

module.exports = router;

