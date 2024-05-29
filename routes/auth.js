const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const User = require('../models/Users'); // Ensure this path is correct
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const fetchuser = require('../middleware/fetchuser');
const JWT_SIGN = "Jitcodeissuper";

// Route 1: Create a user using POST "api/auth/createuser". Does not require auth
router.post('/createuser', [
  body('email', 'Enter a valid email').isEmail(),
  body('name', 'Enter a valid name').isLength({ min: 3 }),
  body('password', 'Password must be longer than 6 characters').isLength({ min: 6 })
], async (req, res) => {
  const errors = validationResult(req);
  let success = false;

  // If there are validation errors, return bad request and errors
  if (!errors.isEmpty()) {
    return res.status(400).json({ success, errors: errors.array() });
  }

  try {
    // Check whether user exists
    let existingUser = await User.findOne({ email: req.body.email });
    if (existingUser) {
      return res.status(400).json({ success, error: "User already exists" });
    }

    // Encrypt password
    const salt = await bcrypt.genSalt(11);
    const secPassword = await bcrypt.hash(req.body.password, salt);

    // Create new user
    let newUser = new User({
      name: req.body.name,
      password: secPassword,
      email: req.body.email
    });

    // Save user to the database
    await newUser.save();

    // Create JWT payload
    const payload = {
      user: {
        id: newUser.id
      }
    };

    // Generate JWT token
    const authtoken = jwt.sign(payload, JWT_SIGN);
    success = true;
    
    // Send response with token
    res.json({ success, authtoken });
  } catch (error) {
    console.error('Error creating user:', error);
    res.status(500).json({ success, error: "Internal Server Error" });
  }
});

// Route 2: Authenticate user using POST "api/auth/login"
router.post('/login', [
  body('email', 'Enter a valid email').isEmail(),
  body('password', 'Password should not be blank').exists()
], async (req, res) => {
  const errors = validationResult(req);
  let success = false;

  // If there are validation errors, return bad request and errors
  if (!errors.isEmpty()) {
    return res.status(400).json({ success, errors: errors.array() });
  }

  const { email, password } = req.body;

  try {
    let user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ success, error: "Invalid credentials" });
    }

    const passCompare = await bcrypt.compare(password, user.password);
    if (!passCompare) {
      return res.status(400).json({ success, error: "Invalid credentials" });
    }

    const payload = {
      user: {
        id: user.id
      }
    };

    const authtoken = jwt.sign(payload, JWT_SIGN);
    success = true;

    // Send response with token
    res.json({ success, authtoken });
  } catch (error) {
    console.error('Error logging in user:', error);
    res.status(500).json({ success, error: "Internal Server Error" });
  }
});

// Route 3: Get logged-in user details using POST "/api/auth/getuser". Login required
router.post('/getuser', fetchuser, async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await User.findById(userId).select("-password");
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    res.json(user);
  } catch (error) {
    console.error('Error fetching user details:', error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

module.exports = router;
