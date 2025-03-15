
const express = require('express');
const router = express.Router();
const analyticsController = require('../controllers/analyticsController');
const auth = require('../middleware/auth');

// All routes require authentication
router.use(auth);

// Analytics routes
router.get('/overview', analyticsController.getAnalyticsOverview);
router.get('/detailed', analyticsController.getDetailedAnalytics);

module.exports = router;
