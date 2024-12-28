const express = require('express');
const LocationLog = require('../models/LocationLog');
 // Importing io from server.js

const router = express.Router();

router.post('/', async (req, res) => {
  const { userId, location } = req.body;

  try {
    // Save location log to the database
    const log = await LocationLog.create({ userId, location });
    // Send the response first
    res.status(201).json({ message: 'Location logged', log });
  } catch (error) {
    console.error('Error saving location:', error);
    res.status(500).send('Failed to log location');
  }
});

module.exports = router;
