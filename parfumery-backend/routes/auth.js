// parfumery-backend/routes/auth.js
const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const auth = require('../middleware/auth');
const router = express.Router();
require('dotenv').config();
// Register
router.post('/register', async (req, res) => {
  const { username, password, email } = req.body;

  if (!username || !password || !email) {
    return res.status(400).json({ msg: 'Please enter all fields' });
  }

  try {
    console.log('Received data:', { username, password, email });
    
    let user = await User.findOne({ username });
    if (user) {
      console.log('User already exists');
      return res.status(400).json({ msg: 'User already exists' });
    }

    user = new User({ username, password, email });

    const salt = await bcrypt.genSalt(10);
    console.log('Salt generated:', salt);
    
    user.password = await bcrypt.hash(password, salt);
    console.log('Password hashed:', user.password);

    await user.save();
    console.log('User saved successfully');

    const payload = { user: { id: user.id } };

    jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' }, (err, token) => {
      if (err) {
        console.error('JWT signing error:', err);
        return res.status(500).json({ msg: 'Server error' });
      }

      res.status(201).json({ token, msg: 'User registered successfully' });
    });
  } catch (err) {
    console.error('Registration error:', err);
    res.status(500).json({ msg: 'Server error' });
  }
});



// Login
router.post('/login', async (req, res) => {
  const { username, password } = req.body;
  try {
    let user = await User.findOne({ username });
    if (!user) return res.status(400).json({ msg: 'Invalid credentials' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ msg: 'Invalid credentials' });

    const payload = { user: { id: user.id } };
    jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' }, (err, token) => {
      if (err) throw err;
      res.json({ token });
    });
  } catch (err) {
    res.status(500).send('Server error');
  }
});

// Get logged-in user
router.get('/', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    res.json(user);
  } catch (err) {
    res.status(500).send('Server error');
  }
});

module.exports = router;
