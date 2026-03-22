// backend/src/routes/auth.js
const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Profile = require('../models/Profile');
const bcrypt = require('bcryptjs');

const router = express.Router();

// Register
router.post('/register', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password required' });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ error: 'User already exists' });
    }

    const user = new User({ email, passwordHash: password });
    await user.save();

    // Create basic profile with default budget
    await Profile.create({
      userId: user._id,
      name: email.split('@')[0],
      budgetMin: 5000,
      budgetMax: 15000,
    });

    res.status(201).json({ message: 'User created, profile initialized' });
  } catch (err) {
    console.error('Register error:', err.message || err);
    if (err.name === 'ValidationError') {
      return res.status(400).json({ error: err.message });
    }
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password required' });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { userId: user._id, email: user.email, isVerified: user.isVerified },
      process.env.JWT_SECRET || 'roomiez-secret-please-change-in-env',
      { expiresIn: '24h' }
    );

    res.json({
      token,
      user: {
        id: user._id,
        email: user.email,
        isVerified: user.isVerified,
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Protected: me
router.get('/me', async (req, res) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) {
    return res.status(401).json({ error: 'Authentication required' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'roomiez-secret-please-change-in-env');
    const user = await User.findById(decoded.userId).select('-passwordHash');

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const profile = await Profile.findOne({ userId: user._id });
    const questionnaire = await require('../models/Questionnaire').findOne({ userId: user._id });

    res.json({
      user,
      profile,
      questionnaire,
    });
  } catch (err) {
    if (err.name === 'JsonWebTokenError') {
      return res.status(401).json({ error: 'Invalid or expired token' });
    }
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
