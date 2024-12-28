const express = require('express');
const User = require('../models/User');

const router = express.Router();

// Register
router.post('/register', async (req, res) => {
  const { username, email, password } = req.body;

  if (!username || !email || !password){
    return res.status(400).json({message: "Please enter the Credentials"})
  }
  try {
    const existingUser = await User.findOne({ 
      $or: [ { username }, { email } ] 
    });
    if(password.length < 6){
      return res.status(400).json({ message: 'Password must be at least 6 characters long' });
    }
    if (existingUser) {
      if (existingUser.username === username) {
        return res.status(400).json({ message: 'Username already exists' });
      }
      if (existingUser.email === email) {
        return res.status(400).json({ message: 'Email already exists' });
      }
    }

    // Create a new user
    const user = new User({ username, email, password });
    await user.save();

    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    console.error('Error registering user:', error);
    res.status(500).json({ message: 'Failed to register user' });
  }
});


// Login
router.post('/login', async (req, res) => {
  console.log('in login')
  const { username, password } = req.body;
  console.log(req.body)
  try {
    const user = await User.findOne({ username });
    if (!user) return res.status(400).json({ message: 'Invalid username or password' });

    const isValid = await user.isValidPassword(password);
    if (!isValid) return res.status(400).json({ message: 'Invalid username or password' });
    console.log('success')
    res.status(200).json({ user });
  } catch (error) {
    console.error('Error logging in:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
