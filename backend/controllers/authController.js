const User = require('../models/User');
const jwt = require('jsonwebtoken');

// Generate JWT Token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d', // Token expires in 30 days
  });
};

// @desc    Register a new user (Admin)
// @route   POST /api/auth/register
const registerUser = async (req, res) => {
  try {
    const { name, username, email, password } = req.body;

    // Check if user already exists by email OR username
    const userExists = await User.findOne({ $or: [{ email }, { username }] });
    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Create new user in the database
    const user = await User.create({
      name,
      username,
      email,
      password,
    });

    // If user is successfully created, send back user data and token
    if (user) {
      res.status(201).json({
        _id: user._id,
        name: user.name,
        username: user.username,
        email: user.email,
        token: generateToken(user._id),
      });
    } else {
      res.status(400).json({ message: 'Invalid user data' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Auth user & get token (Login)
// @route   POST /api/auth/login
const loginUser = async (req, res) => {
  try {
    // Get the username or email provided in the request body
    const { username, email, password } = req.body;
    const loginIdentifier = username || email;

    // Find user by email OR username
    const user = await User.findOne({
      $or: [{ email: loginIdentifier }, { username: loginIdentifier }]
    });

    // Check if user exists and password matches
    if (user && (await user.matchPassword(password))) {
      res.json({
        _id: user._id,
        name: user.name,
        username: user.username,
        email: user.email,
        token: generateToken(user._id),
      });
    } else {
      res.status(401).json({ message: 'Invalid email/username or password' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get logged-in admin profile
// @route   GET /api/auth/profile
const getProfile = async (req, res) => {
  try {

    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({
        message: "User not found"
      });
    }

    res.json({
      _id: user._id,
      name: user.name,
      username: user.username,
      email: user.email
    });

  } catch (error) {

    console.error(error);

    res.status(500).json({
      message: "Server error"
    });

  }
};

// @desc    Change admin password
// @route   PUT /api/auth/change-password
const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    // Get logged-in user from middleware
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({
        message: 'User not found'
      });
    }

    // Check current password
    const isMatch = await user.matchPassword(currentPassword);

    if (!isMatch) {
      return res.status(401).json({
        message: 'Current password is incorrect.'
      });
    }

    // Check new password length
    if (newPassword.length < 6) {
      return res.status(400).json({
        message: 'New password must be at least 6 characters.'
      });
    }

    // Update password
    user.password = newPassword;

    await user.save();

    res.json({
      message: 'Password updated successfully.'
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: 'Server error'
    });
  }
};

module.exports = { registerUser, loginUser, getProfile ,changePassword};