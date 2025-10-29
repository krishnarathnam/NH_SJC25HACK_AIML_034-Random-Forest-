const jwt = require('jsonwebtoken');

const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET || 'your-access-secret-change-in-production';
const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET || 'your-refresh-secret-change-in-production';

// Sign access token (short-lived: 15 minutes)
function signAccessToken(user) {
  return jwt.sign(
    { sub: user._id.toString() },
    ACCESS_TOKEN_SECRET,
    { expiresIn: '1d' }
  );
}

// Sign refresh token (long-lived: 7 days)
function signRefreshToken(user) {
  return jwt.sign(
    { sub: user._id.toString(), tv: user.tokenVersion },
    REFRESH_TOKEN_SECRET,
    { expiresIn: '7d' }
  );
}

// Verify access token
function verifyAccess(token) {
  try {
    return jwt.verify(token, ACCESS_TOKEN_SECRET);
  } catch (error) {
    throw new Error('Invalid/expired token');
  }
}

// Verify refresh token
function verifyRefresh(token) {
  try {
    return jwt.verify(token, REFRESH_TOKEN_SECRET);
  } catch (error) {
    throw new Error('Invalid/expired token');
  }
}

module.exports = {
  signAccessToken,
  signRefreshToken,
  verifyAccess,
  verifyRefresh,
};

