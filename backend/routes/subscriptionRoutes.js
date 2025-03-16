
const express = require('express');
const router = express.Router();
const subscriptionController = require('../controllers/subscriptionController');
const auth = require('../middleware/auth');
const { checkAdminRole } = require('../middleware/checkRole');

// Public route for getting subscription plans
router.get('/plans', subscriptionController.getPlans);
router.get('/plans/:id', subscriptionController.getPlanById);

// All routes below require authentication
router.use(auth);

// User subscription routes
router.get('/', subscriptionController.getSubscription);
router.post('/upgrade', subscriptionController.upgradePlan);
router.post('/cancel', subscriptionController.cancelSubscription);
router.post('/create-order', subscriptionController.createOrder);
router.post('/verify-payment', subscriptionController.verifyPayment);

// Admin-only routes
router.get('/subscribers', checkAdminRole, subscriptionController.getAllSubscribers);
router.post('/plans', checkAdminRole, subscriptionController.createPlan);
router.put('/plans/:id', checkAdminRole, subscriptionController.updatePlan);
router.delete('/plans/:id', checkAdminRole, subscriptionController.deletePlan);

module.exports = router;
