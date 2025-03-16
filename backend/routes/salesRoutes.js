
const express = require('express');
const router = express.Router();
const salesController = require('../controllers/salesController');
const auth = require('../middleware/auth');
const { checkAdminRole } = require('../middleware/checkRole');

// All routes require authentication and admin role
router.use(auth);
router.use(checkAdminRole);

// Sales routes
router.get('/overview', salesController.getSalesOverview);
router.get('/revenue', salesController.getRevenueDetails);
router.get('/plan-distribution', salesController.getPlanDistribution);

module.exports = router;
