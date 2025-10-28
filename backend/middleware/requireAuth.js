const { verifyAccess } = require('../utils/jwt');

function requireAuth(req, res, next) {
  const authHeader = req.headers.authorization;
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'No token provided' });
  }
  
  const token = authHeader.substring(7); // Remove 'Bearer ' prefix
  
  try {
    const payload = verifyAccess(token);
    req.userId = payload.sub; // Attach userId to request
    next();
  } catch (error) {
    return res.status(401).json({ error: 'Invalid/expired token' });
  }
}

module.exports = requireAuth;

