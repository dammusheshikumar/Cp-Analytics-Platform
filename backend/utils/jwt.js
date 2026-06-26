// utils/jwt.js
// Small wrapper around jsonwebtoken so token logic lives in one place.

const jwt = require('jsonwebtoken');

// FALLBACK FIX: If process.env.JWT_SECRET is undefined, use a local string
const JWT_SECRET = process.env.JWT_SECRET || 'super_secret_local_development_key_123';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';

/**
 * Sign a token for a given user payload (we only ever embed id + email,
 * never the password hash).
 */
function generateToken(user) {
  return jwt.sign(
    { id: user.id, email: user.email },
    JWT_SECRET,
    { expiresIn: JWT_EXPIRES_IN }
  );
}

/**
 * Verify a token, returns decoded payload or throws.
 */
function verifyToken(token) {
  return jwt.verify(token, JWT_SECRET);
}

module.exports = { generateToken, verifyToken };