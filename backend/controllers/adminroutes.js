const express = require('express');
const router = express.Router();

// Load admin credentials from environment variables
const adminUsername = process.env.ADMIN_USERNAME;
const adminPassword = process.env.ADMIN_PASSWORD;

// Admin login endpoint
router.post('/login', (req, res) => {
  const { username, password } = req.body;

  if (username === adminUsername && password === adminPassword) {
    return res.status(200).json({ message: 'Login successful' });
  } else {
    return res.status(401).json({ message: 'Invalid credentials' });
  }
});

module.exports = router;
