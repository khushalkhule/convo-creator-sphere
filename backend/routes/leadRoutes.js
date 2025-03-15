
const express = require('express');
const router = express.Router();
const leadController = require('../controllers/leadController');
const auth = require('../middleware/auth');

// All routes require authentication
router.use(auth);

// Lead routes
router.get('/', leadController.getLeads);
router.post('/', leadController.createLead);
router.get('/export', leadController.exportLeads);

module.exports = router;
