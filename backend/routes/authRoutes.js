const express = require('express');
const router = express.Router();
const { registerUser, loginUser, getProfile, changePassword } = require('../controllers/authController');

const { protect } = require('../middleware/authMiddleware');

// Route for user registration
// POST /api/auth/register
router.post('/register', registerUser);

// Route for user login
// POST /api/auth/login
router.post('/login', loginUser);

// Get logged-in admin profile
router.get('/profile', protect, getProfile);

// Change password
router.put('/change-password', protect, changePassword);

module.exports = router;