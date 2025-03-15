
const express = require('express');
const router = express.Router();
const subscriptionController = require('../controllers/subscriptionController');
const auth = require('../middleware/auth');

// All routes require authentication
router.use(auth);

// Subscription routes
router.get('/', subscriptionController.getSubscription);
router.get('/plans', subscriptionController.getPlans);
router.post('/upgrade', subscriptionController.upgradePlan);
router.post('/cancel', subscriptionController.cancelSubscription);

module.exports = router;
