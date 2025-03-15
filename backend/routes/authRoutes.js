
const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const auth = require('../middleware/auth');
const pool = require('../config/db');

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

// Test database connection
router.get('/test-db', async (req, res) => {
  try {
    // Get a connection from the pool
    const connection = await pool.getConnection();
    
    // Release the connection
    connection.release();
    
    // If we get here, the connection was successful
    res.status(200).json({ 
      success: true, 
      message: 'Database connection successful' 
    });
  } catch (error) {
    // If we get here, the connection failed
    res.status(500).json({ 
      success: false, 
      message: 'Database connection failed', 
      error: error.message 
    });
  }
});

module.exports = router;
