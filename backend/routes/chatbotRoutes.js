
const express = require('express');
const router = express.Router();
const chatbotController = require('../controllers/chatbotController');
const auth = require('../middleware/auth');

// All routes require authentication
router.use(auth);

// Chatbot routes
router.get('/', chatbotController.getChatbots);
router.post('/', chatbotController.createChatbot);
router.get('/:id', chatbotController.getChatbot);
router.put('/:id', chatbotController.updateChatbot);
router.delete('/:id', chatbotController.deleteChatbot);

module.exports = router;
