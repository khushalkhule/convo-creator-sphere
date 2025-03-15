
const express = require('express');
const router = express.Router();
const chatbotWizardController = require('../controllers/chatbotWizardController');
const auth = require('../middleware/auth');

// All routes require authentication
router.use(auth);

// Chatbot wizard routes
router.get('/steps', chatbotWizardController.getWizardSteps);
router.post('/basic-info', chatbotWizardController.createBasicInfo);
router.put('/:id/knowledge-base', chatbotWizardController.updateKnowledgeBase);
router.put('/:id/ai-model', chatbotWizardController.updateAIModel);
router.put('/:id/design', chatbotWizardController.updateDesign);
router.put('/:id/lead-form', chatbotWizardController.updateLeadForm);
router.get('/:id/summary', chatbotWizardController.getChatbotSummary);
router.put('/:id/finalize', chatbotWizardController.finalizeChatbot);

module.exports = router;
