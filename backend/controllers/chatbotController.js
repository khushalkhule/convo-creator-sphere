
const pool = require('../config/db');
const { v4: uuidv4 } = require('uuid');

// Get all chatbots for a user
exports.getChatbots = async (req, res) => {
  try {
    const [chatbots] = await pool.query(
      'SELECT * FROM chatbots WHERE user_id = ?',
      [req.user.id]
    );
    
    res.status(200).json(chatbots);
  } catch (error) {
    console.error('Get chatbots error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get a single chatbot
exports.getChatbot = async (req, res) => {
  try {
    const [chatbots] = await pool.query(
      'SELECT * FROM chatbots WHERE id = ? AND user_id = ?',
      [req.params.id, req.user.id]
    );
    
    if (chatbots.length === 0) {
      return res.status(404).json({ message: 'Chatbot not found' });
    }
    
    res.status(200).json(chatbots[0]);
  } catch (error) {
    console.error('Get chatbot error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Create a chatbot
exports.createChatbot = async (req, res) => {
  try {
    const { name, description, configuration } = req.body;
    
    // Generate UUID
    const chatbotId = uuidv4();
    
    await pool.query(
      'INSERT INTO chatbots (id, user_id, name, description, configuration) VALUES (?, ?, ?, ?, ?)',
      [chatbotId, req.user.id, name, description, JSON.stringify(configuration || {})]
    );
    
    res.status(201).json({
      id: chatbotId,
      name,
      description,
      configuration: configuration || {},
      user_id: req.user.id,
      created_at: new Date(),
      status: 'draft'
    });
  } catch (error) {
    console.error('Create chatbot error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Update a chatbot
exports.updateChatbot = async (req, res) => {
  try {
    const { name, description, configuration, status } = req.body;
    
    // Check if chatbot exists and belongs to user
    const [chatbots] = await pool.query(
      'SELECT * FROM chatbots WHERE id = ? AND user_id = ?',
      [req.params.id, req.user.id]
    );
    
    if (chatbots.length === 0) {
      return res.status(404).json({ message: 'Chatbot not found' });
    }
    
    // Update chatbot
    await pool.query(
      'UPDATE chatbots SET name = ?, description = ?, configuration = ?, status = ? WHERE id = ?',
      [
        name || chatbots[0].name, 
        description || chatbots[0].description, 
        JSON.stringify(configuration || JSON.parse(chatbots[0].configuration)),
        status || chatbots[0].status,
        req.params.id
      ]
    );
    
    res.status(200).json({
      id: req.params.id,
      name: name || chatbots[0].name,
      description: description || chatbots[0].description,
      configuration: configuration || JSON.parse(chatbots[0].configuration),
      status: status || chatbots[0].status,
      user_id: req.user.id,
      created_at: chatbots[0].created_at,
      updated_at: new Date()
    });
  } catch (error) {
    console.error('Update chatbot error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Delete a chatbot
exports.deleteChatbot = async (req, res) => {
  try {
    // Check if chatbot exists and belongs to user
    const [chatbots] = await pool.query(
      'SELECT * FROM chatbots WHERE id = ? AND user_id = ?',
      [req.params.id, req.user.id]
    );
    
    if (chatbots.length === 0) {
      return res.status(404).json({ message: 'Chatbot not found' });
    }
    
    // Delete chatbot
    await pool.query('DELETE FROM chatbots WHERE id = ?', [req.params.id]);
    
    res.status(200).json({ message: 'Chatbot deleted successfully' });
  } catch (error) {
    console.error('Delete chatbot error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
