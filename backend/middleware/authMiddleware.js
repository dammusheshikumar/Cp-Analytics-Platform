// middleware/authMiddleware.js
// Protects routes by requiring a valid JWT in the Authorization header.
// On success, attaches the decoded user payload to req.user.

const { verifyToken } = require('../utils/jwt');

function protect(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Not authorized, no token provided' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = verifyToken(token);
    req.user = decoded; // { id, email, iat, exp }
    next();
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      return res.status(401).json({ message: 'Session expired, please log in again' });
    }
    return res.status(401).json({ message: 'Not authorized, invalid token' });
  }
}

module.exports = { protect };
