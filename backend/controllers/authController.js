// controllers/authController.js
// Handles register / login / logout / me for JWT auth

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
 * REGISTER
 */
const register = asyncHandler(async (req, res) => {
  const { name, email, password, mobile } = req.body;

  // Validation
  if (!name || !email || !password || !mobile) {
    res.status(400);
    throw new Error('Name, email, password, and mobile are required');
  }

  if (password.length < 6) {
    res.status(400);
    throw new Error('Password must be at least 6 characters long');
  }

  // Check existing user
  const existingUser = await findUserByEmail(email.toLowerCase().trim());
  if (existingUser) {
    res.status(409);
    throw new Error('An account with this email already exists');
  }

  // Hash password
  const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);

  // Create user (NOW INCLUDING MOBILE)
  const userId = await createUser({
    name: name.trim(),
    email: email.toLowerCase().trim(),
    passwordHash,
    mobile: mobile.trim()
  });

  const userPayload = {
    id: userId,
    email: email.toLowerCase().trim()
  };

  const token = generateToken(userPayload);

  res.status(201).json({
    message: 'Account created successfully',
    token,
    user: {
      id: userId,
      name: name.trim(),
      email: email.toLowerCase().trim()
    }
  });
});

/**
 * LOGIN
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
    user: {
      id: user.id,
      name: user.name,
      email: user.email
    }
  });
});

/**
 * LOGOUT
 */
const logout = asyncHandler(async (req, res) => {
  res.json({ message: 'Logged out successfully' });
});

/**
 * GET PROFILE
 */
const getMe = asyncHandler(async (req, res) => {
  const user = await findUserById(req.user.id);

  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }

  res.json({ user });
});

module.exports = {
  register,
  login,
  logout,
  getMe
};