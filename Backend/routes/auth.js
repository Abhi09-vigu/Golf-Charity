const express = require('express');
const router = express.Router();
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { authMiddleware } = require('../middleware/auth');

const cookieOptions = {
  httpOnly: true,
  secure: true, // Required for cross-site cookies
  sameSite: 'none' // Required for Vercel -> Render cross-origin
};
// Signup
router.post('/signup', async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    let user = await User.findOne({ email });
    if (user) return res.status(400).json({ message: 'User already exists' });

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    user = new User({ name, email, password: hashedPassword, role });
    await user.save();

    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET || 'secret123', { expiresIn: '1d' });
    res.cookie('token', token, cookieOptions).status(201).json({ message: 'User created successfully', user: { id: user._id, name, email, role } });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: 'Invalid credentials' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET || 'secret123', { expiresIn: '1d' });
    res.cookie('token', token, cookieOptions).json({ message: 'Logged in', user: { id: user._id, name: user.name, email, role: user.role } });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Logout
router.post('/logout', (req, res) => {
  res.cookie('token', '', { ...cookieOptions, expires: new Date(0) }).json({ message: 'Logged out successfully' });
});

// Check Session to verify user logic and maintain cookies
router.get('/check', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (!user) return res.status(401).json({ message: 'Invalid session/User not found' });
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
