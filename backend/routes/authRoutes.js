
const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const auth = require('../middleware/auth');

// Public routes
router.post('/register', authController.register);
router.post('/login', authController.login);
router.post('/create-admin', authController.createAdmin);

// Protected routes
router.get('/me', auth, authController.getMe);

// Test route to verify the backend is working
router.get('/test', (req, res) => {
  res.status(200).json({ message: 'Auth routes working' });
});

module.exports = router;
