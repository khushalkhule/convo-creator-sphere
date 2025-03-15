
const express = require('express');
const router = express.Router();
const integrationController = require('../controllers/integrationController');
const auth = require('../middleware/auth');

// All routes require authentication
router.use(auth);

// Integration routes
router.get('/', integrationController.getIntegrations);
router.post('/instagram', integrationController.configureInstagram);
router.post('/zapier', integrationController.configureZapier);
router.post('/hubspot', integrationController.configureHubspot);
router.delete('/:id', integrationController.deleteIntegration);

module.exports = router;
