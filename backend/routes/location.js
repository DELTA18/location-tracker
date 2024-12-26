const express = require('express');
const LocationLog = require('../models/LocationLog');

const router = express.Router();

router.post('/', async (req, res) => {
  const { userId, location } = req.body;

  try {
    const log = await LocationLog.create({ userId, location });
    res.status(201).json({ message: 'Location logged', log });
  } catch (error) {
    console.error('Error saving location:', error);
    res.status(500).send('Failed to log location');
  }
});

module.exports = router;
