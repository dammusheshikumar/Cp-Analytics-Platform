// controllers/authController.js
// Handles register / login / logout / "who am I" for JWT-based auth.

const bcrypt = require('bcryptjs');
const asyncHandler = require('../utils/asyncHandler');
const { generateToken } = require('../utils/jwt');
const {
  createUser,
  findUserByEmail,
  findUserById
} = require('../models/userModel');

const SALT_ROUNDS = 10;

/**
 * @route   POST /api/auth/register
 * @access  Public
 */
const register = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    res.status(400);
    throw new Error('Name, email, and password are all required');
  }

  if (password.length < 6) {
    res.status(400);
    throw new Error('Password must be at least 6 characters long');
  }

  const existingUser = await findUserByEmail(email.toLowerCase().trim());
  if (existingUser) {
    res.status(409);
    throw new Error('An account with this email already exists');
  }

  const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);
  const userId = await createUser({
    name: name.trim(),
    email: email.toLowerCase().trim(),
    passwordHash
  });

  const user = { id: userId, email: email.toLowerCase().trim() };
  const token = generateToken(user);

  res.status(201).json({
    message: 'Account created successfully',
    token,
    user: { id: userId, name: name.trim(), email: user.email }
  });
});

/**
 * @route   POST /api/auth/login
 * @access  Public
 */
const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    res.status(400);
    throw new Error('Email and password are required');
  }

  const user = await findUserByEmail(email.toLowerCase().trim());
  if (!user) {
    res.status(401);
    throw new Error('Invalid email or password');
  }

  const passwordMatches = await bcrypt.compare(password, user.password_hash);
  if (!passwordMatches) {
    res.status(401);
    throw new Error('Invalid email or password');
  }

  const token = generateToken(user);

  res.json({
    message: 'Logged in successfully',
    token,
    user: { id: user.id, name: user.name, email: user.email }
  });
});

/**
 * @route   POST /api/auth/logout
 * @access  Private
 * Note: JWTs are stateless, so "logout" is handled by the client deleting
 * its stored token. This endpoint exists for a consistent API contract
 * and a place to add token-blacklisting later if ever needed.
 */
const logout = asyncHandler(async (req, res) => {
  res.json({ message: 'Logged out successfully' });
});

/**
 * @route   GET /api/auth/me
 * @access  Private
 */
const getMe = asyncHandler(async (req, res) => {
  const user = await findUserById(req.user.id);
  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }
  res.json({ user });
});

module.exports = { register, login, logout, getMe };
