const pool = require('../config/db');
const { v4: uuidv4 } = require('uuid');

// Get chatbot creation steps (just returns static data)
exports.getWizardSteps = async (req, res) => {
  try {
    const steps = [
      { id: 1, name: 'Basic Info', completed: false, current: true },
      { id: 2, name: 'Knowledge Base', completed: false, current: false },
      { id: 3, name: 'AI Model', completed: false, current: false },
      { id: 4, name: 'Design', completed: false, current: false },
      { id: 5, name: 'Lead Form', completed: false, current: false },
      { id: 6, name: 'Summary', completed: false, current: false },
    ];
    
    res.status(200).json(steps);
  } catch (error) {
    console.error('Get wizard steps error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Create a new chatbot with basic info (step 1)
exports.createBasicInfo = async (req, res) => {
  try {
    const { name, description, website_url, team } = req.body;
    const user_id = req.user.id;
    
    if (!name) {
      return res.status(400).json({ message: 'Chatbot name is required' });
    }
    
    console.log('Creating chatbot with data:', { name, description, website_url, team });
    
    // Generate UUID for new chatbot
    const chatbotId = uuidv4();
    
    // Get team_id if provided
    let team_id = null;
    if (team) {
      const [teams] = await pool.query(
        'SELECT id FROM teams WHERE name = ? AND user_id = ?',
        [team, user_id]
      );
      
      if (teams.length > 0) {
        team_id = teams[0].id;
      } else {
        // Create new team if it doesn't exist
        team_id = uuidv4();
        await pool.query(
          'INSERT INTO teams (id, name, user_id) VALUES (?, ?, ?)',
          [team_id, team, user_id]
        );
      }
    }
    
    // Create new chatbot
    await pool.query(
      'INSERT INTO chatbots (id, user_id, name, description, website_url, team_id, status) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [chatbotId, user_id, name, description, website_url, team_id, 'draft']
    );
    
    // Create default configuration
    const configId = uuidv4();
    await pool.query(
      'INSERT INTO chatbot_configurations (id, chatbot_id) VALUES (?, ?)',
      [configId, chatbotId]
    );
    
    console.log('Chatbot created with ID:', chatbotId);
    
    res.status(201).json({
      id: chatbotId,
      name,
      description,
      website_url,
      team_id,
      status: 'draft',
      step: 1
    });
  } catch (error) {
    console.error('Create chatbot basic info error:', error);
    res.status(500).json({ message: 'Server error creating chatbot: ' + error.message });
  }
};

// Update knowledge base (step 2)
exports.updateKnowledgeBase = async (req, res) => {
  try {
    const { knowledge_base } = req.body;
    const chatbot_id = req.params.id;
    const user_id = req.user.id;
    
    console.log('Updating knowledge base for chatbot ID:', chatbot_id, 'with data:', knowledge_base);
    
    // Verify chatbot belongs to user
    const [chatbots] = await pool.query(
      'SELECT id FROM chatbots WHERE id = ? AND user_id = ?',
      [chatbot_id, user_id]
    );
    
    if (chatbots.length === 0) {
      return res.status(404).json({ message: 'Chatbot not found' });
    }
    
    // Update configuration
    await pool.query(
      'UPDATE chatbot_configurations SET knowledge_base = ? WHERE chatbot_id = ?',
      [JSON.stringify(knowledge_base), chatbot_id]
    );
    
    // Also insert into knowledge_base table if content is provided
    if (knowledge_base && knowledge_base.content) {
      const kb_id = uuidv4();
      const content_type = knowledge_base.type || 'text';
      
      await pool.query(
        'INSERT INTO knowledge_base (id, chatbot_id, content_type, content, source) VALUES (?, ?, ?, ?, ?)',
        [kb_id, chatbot_id, content_type, knowledge_base.content, knowledge_base.source || '']
      );
    }
    
    console.log('Knowledge base updated successfully');
    
    res.status(200).json({
      id: chatbot_id,
      knowledge_base,
      step: 2
    });
  } catch (error) {
    console.error('Update knowledge base error:', error);
    res.status(500).json({ message: 'Server error updating knowledge base: ' + error.message });
  }
};

// Update AI model settings (step 3)
exports.updateAIModel = async (req, res) => {
  try {
    const { ai_model, temperature, max_tokens } = req.body;
    const chatbot_id = req.params.id;
    const user_id = req.user.id;
    
    // Verify chatbot belongs to user
    const [chatbots] = await pool.query(
      'SELECT id FROM chatbots WHERE id = ? AND user_id = ?',
      [chatbot_id, user_id]
    );
    
    if (chatbots.length === 0) {
      return res.status(404).json({ message: 'Chatbot not found' });
    }
    
    // Update configuration
    await pool.query(
      'UPDATE chatbot_configurations SET ai_model = ?, temperature = ?, max_tokens = ? WHERE chatbot_id = ?',
      [ai_model, temperature, max_tokens, chatbot_id]
    );
    
    res.status(200).json({
      id: chatbot_id,
      ai_model,
      temperature,
      max_tokens,
      step: 3
    });
  } catch (error) {
    console.error('Update AI model error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Update design settings (step 4)
exports.updateDesign = async (req, res) => {
  try {
    const { 
      theme, 
      initial_message, 
      suggested_messages, 
      display_name, 
      footer_links,
      user_message_color,
      auto_open_delay,
      input_placeholder
    } = req.body;
    
    const chatbot_id = req.params.id;
    const user_id = req.user.id;
    
    // Verify chatbot belongs to user
    const [chatbots] = await pool.query(
      'SELECT id FROM chatbots WHERE id = ? AND user_id = ?',
      [chatbot_id, user_id]
    );
    
    if (chatbots.length === 0) {
      return res.status(404).json({ message: 'Chatbot not found' });
    }
    
    // Update configuration
    await pool.query(
      `UPDATE chatbot_configurations SET 
       theme = ?, 
       initial_message = ?, 
       suggested_messages = ?, 
       display_name = ?, 
       footer_links = ?,
       user_message_color = ?,
       auto_open_delay = ?,
       input_placeholder = ?
       WHERE chatbot_id = ?`,
      [
        theme, 
        initial_message, 
        JSON.stringify(suggested_messages), 
        display_name, 
        JSON.stringify(footer_links),
        user_message_color,
        auto_open_delay,
        input_placeholder,
        chatbot_id
      ]
    );
    
    res.status(200).json({
      id: chatbot_id,
      theme,
      initial_message,
      suggested_messages,
      display_name,
      footer_links,
      user_message_color,
      auto_open_delay,
      input_placeholder,
      step: 4
    });
  } catch (error) {
    console.error('Update design error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Update lead form settings (step 5)
exports.updateLeadForm = async (req, res) => {
  try {
    const { 
      lead_form_enabled, 
      lead_form_title, 
      lead_form_description, 
      lead_form_success_message,
      lead_form_fields
    } = req.body;
    
    const chatbot_id = req.params.id;
    const user_id = req.user.id;
    
    // Verify chatbot belongs to user
    const [chatbots] = await pool.query(
      'SELECT id FROM chatbots WHERE id = ? AND user_id = ?',
      [chatbot_id, user_id]
    );
    
    if (chatbots.length === 0) {
      return res.status(404).json({ message: 'Chatbot not found' });
    }
    
    // Update configuration
    await pool.query(
      `UPDATE chatbot_configurations SET 
       lead_form_enabled = ?, 
       lead_form_title = ?, 
       lead_form_description = ?, 
       lead_form_success_message = ?,
       lead_form_fields = ?
       WHERE chatbot_id = ?`,
      [
        lead_form_enabled ? 1 : 0, 
        lead_form_title, 
        lead_form_description, 
        lead_form_success_message,
        JSON.stringify(lead_form_fields),
        chatbot_id
      ]
    );
    
    res.status(200).json({
      id: chatbot_id,
      lead_form_enabled,
      lead_form_title,
      lead_form_description,
      lead_form_success_message,
      lead_form_fields,
      step: 5
    });
  } catch (error) {
    console.error('Update lead form error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get chatbot summary (final step)
exports.getChatbotSummary = async (req, res) => {
  try {
    const chatbot_id = req.params.id;
    const user_id = req.user.id;
    
    // Verify chatbot belongs to user
    const [chatbots] = await pool.query(
      'SELECT * FROM chatbots WHERE id = ? AND user_id = ?',
      [chatbot_id, user_id]
    );
    
    if (chatbots.length === 0) {
      return res.status(404).json({ message: 'Chatbot not found' });
    }
    
    // Get configuration
    const [configs] = await pool.query(
      'SELECT * FROM chatbot_configurations WHERE chatbot_id = ?',
      [chatbot_id]
    );
    
    const chatbot = chatbots[0];
    const config = configs[0];
    
    // Format response
    const summary = {
      basic_info: {
        name: chatbot.name,
        description: chatbot.description,
        website_url: chatbot.website_url
      },
      knowledge_base: {
        source_type: config.knowledge_base ? JSON.parse(config.knowledge_base).type : 'Direct Text',
        content: config.knowledge_base ? JSON.parse(config.knowledge_base).content : ''
      },
      ai_model: {
        model: config.ai_model,
        temperature: config.temperature,
        max_tokens: config.max_tokens
      },
      design: {
        theme: config.theme,
        initial_message: config.initial_message,
        display_name: config.display_name
      },
      lead_form: {
        enabled: config.lead_form_enabled === 1,
        title: config.lead_form_title,
        fields: config.lead_form_fields ? JSON.parse(config.lead_form_fields) : []
      }
    };
    
    res.status(200).json({
      id: chatbot_id,
      summary,
      step: 6
    });
  } catch (error) {
    console.error('Get chatbot summary error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Finalize and activate chatbot
exports.finalizeChatbot = async (req, res) => {
  try {
    const chatbot_id = req.params.id;
    const user_id = req.user.id;
    
    // Verify chatbot belongs to user
    const [chatbots] = await pool.query(
      'SELECT id FROM chatbots WHERE id = ? AND user_id = ?',
      [chatbot_id, user_id]
    );
    
    if (chatbots.length === 0) {
      return res.status(404).json({ message: 'Chatbot not found' });
    }
    
    // Update chatbot status to active
    await pool.query(
      'UPDATE chatbots SET status = ? WHERE id = ?',
      ['active', chatbot_id]
    );
    
    // Update user's usage statistics
    const [userStats] = await pool.query(
      'SELECT id FROM usage_statistics WHERE user_id = ?',
      [user_id]
    );
    
    if (userStats.length === 0) {
      // Create new statistics record
      const statsId = uuidv4();
      await pool.query(
        'INSERT INTO usage_statistics (id, user_id, chatbots_created) VALUES (?, ?, 1)',
        [statsId, user_id]
      );
    } else {
      // Update existing statistics
      await pool.query(
        'UPDATE usage_statistics SET chatbots_created = chatbots_created + 1 WHERE user_id = ?',
        [user_id]
      );
    }
    
    res.status(200).json({
      id: chatbot_id,
      status: 'active',
      message: 'Chatbot successfully activated'
    });
  } catch (error) {
    console.error('Finalize chatbot error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
