const express = require('express');
const router = express.Router();
const User = require('../models/User'); // Assuming you have a User model
const LocationLog = require('../models/LocationLog'); // Assuming you have a LocationLog model

// Admin login endpoint (already added)
const adminUsername = process.env.ADMIN_USERNAME;
const adminPassword = process.env.ADMIN_PASSWORD;

router.post('/login', (req, res) => {
  const { username, password } = req.body;

  if (username === adminUsername && password === adminPassword) {
    return res.status(200).json({ message: 'Login successful' });
  } else {
    return res.status(401).json({ message: 'Invalid credentials' });
  }
});

// Fetch all users
router.get('/users', async (req, res) => {
  try {
    const users = await User.find({}, 'name email'); // Fetch only name and email
    res.status(200).json(users);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch users', error: err.message });
  }
});

// Fetch a specific user's location logs
router.get('/users/:userId/logs', async (req, res) => {
  const { userId } = req.params;
    console.log(userId);
  try {
    const logs = await LocationLog.find({ userId: userId }).sort({ timestamp: -1 }); // Latest logs first
    console.log(logs);
    res.status(200).json(logs);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch location logs', error: err.message });
    console.log(err);
  }
});

module.exports = router;