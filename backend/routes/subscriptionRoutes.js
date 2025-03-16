
const express = require('express');
const router = express.Router();
const subscriptionController = require('../controllers/subscriptionController');
const auth = require('../middleware/auth');
const { checkAdminRole } = require('../middleware/checkRole');

// All routes require authentication
router.use(auth);

// Routes that require authentication only
router.get('/', subscriptionController.getSubscription);
router.get('/plans', subscriptionController.getPlans);
router.post('/upgrade', subscriptionController.upgradePlan);
router.post('/cancel', subscriptionController.cancelSubscription);

// Admin-only routes
router.get('/subscribers', checkAdminRole, subscriptionController.getAllSubscribers);

module.exports = router;
