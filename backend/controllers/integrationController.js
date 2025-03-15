
const pool = require('../config/db');
const { v4: uuidv4 } = require('uuid');

// Get all integrations for a user
exports.getIntegrations = async (req, res) => {
  try {
    const user_id = req.user.id;
    
    const [integrations] = await pool.query(
      'SELECT * FROM integrations WHERE user_id = ?',
      [user_id]
    );
    
    // Format integrations
    const formattedIntegrations = integrations.map(integration => ({
      id: integration.id,
      type: integration.type,
      name: integration.name,
      config: JSON.parse(integration.config),
      status: integration.status,
      created_at: integration.created_at
    }));
    
    res.status(200).json(formattedIntegrations);
  } catch (error) {
    console.error('Get integrations error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Create or update Instagram integration
exports.configureInstagram = async (req, res) => {
  try {
    const user_id = req.user.id;
    const { business_account, dm_automation, ai_model } = req.body;
    
    // Check if integration already exists
    const [existingIntegrations] = await pool.query(
      'SELECT id FROM integrations WHERE user_id = ? AND type = ?',
      [user_id, 'instagram']
    );
    
    const config = {
      business_account,
      dm_automation,
      ai_model
    };
    
    if (existingIntegrations.length > 0) {
      // Update existing integration
      await pool.query(
        'UPDATE integrations SET config = ?, status = ?, updated_at = NOW() WHERE id = ?',
        [JSON.stringify(config), dm_automation ? 'active' : 'inactive', existingIntegrations[0].id]
      );
      
      res.status(200).json({
        id: existingIntegrations[0].id,
        type: 'instagram',
        config,
        status: dm_automation ? 'active' : 'inactive',
        message: 'Instagram integration updated'
      });
    } else {
      // Create new integration
      const integration_id = uuidv4();
      await pool.query(
        'INSERT INTO integrations (id, user_id, type, name, config, status) VALUES (?, ?, ?, ?, ?, ?)',
        [
          integration_id,
          user_id,
          'instagram',
          'Instagram',
          JSON.stringify(config),
          dm_automation ? 'active' : 'inactive'
        ]
      );
      
      res.status(201).json({
        id: integration_id,
        type: 'instagram',
        name: 'Instagram',
        config,
        status: dm_automation ? 'active' : 'inactive',
        message: 'Instagram integration created'
      });
    }
  } catch (error) {
    console.error('Configure Instagram error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Configure Zapier integration
exports.configureZapier = async (req, res) => {
  try {
    const user_id = req.user.id;
    const { webhook_url, active } = req.body;
    
    // Check if integration already exists
    const [existingIntegrations] = await pool.query(
      'SELECT id FROM integrations WHERE user_id = ? AND type = ?',
      [user_id, 'zapier']
    );
    
    const config = {
      webhook_url
    };
    
    if (existingIntegrations.length > 0) {
      // Update existing integration
      await pool.query(
        'UPDATE integrations SET config = ?, status = ?, updated_at = NOW() WHERE id = ?',
        [JSON.stringify(config), active ? 'active' : 'inactive', existingIntegrations[0].id]
      );
      
      res.status(200).json({
        id: existingIntegrations[0].id,
        type: 'zapier',
        config,
        status: active ? 'active' : 'inactive',
        message: 'Zapier integration updated'
      });
    } else {
      // Create new integration
      const integration_id = uuidv4();
      await pool.query(
        'INSERT INTO integrations (id, user_id, type, name, config, status) VALUES (?, ?, ?, ?, ?, ?)',
        [
          integration_id,
          user_id,
          'zapier',
          'Zapier',
          JSON.stringify(config),
          active ? 'active' : 'inactive'
        ]
      );
      
      res.status(201).json({
        id: integration_id,
        type: 'zapier',
        name: 'Zapier',
        config,
        status: active ? 'active' : 'inactive',
        message: 'Zapier integration created'
      });
    }
  } catch (error) {
    console.error('Configure Zapier error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Configure HubSpot integration
exports.configureHubspot = async (req, res) => {
  try {
    const user_id = req.user.id;
    const { api_key, active } = req.body;
    
    // Check if integration already exists
    const [existingIntegrations] = await pool.query(
      'SELECT id FROM integrations WHERE user_id = ? AND type = ?',
      [user_id, 'hubspot']
    );
    
    const config = {
      api_key
    };
    
    if (existingIntegrations.length > 0) {
      // Update existing integration
      await pool.query(
        'UPDATE integrations SET config = ?, status = ?, updated_at = NOW() WHERE id = ?',
        [JSON.stringify(config), active ? 'active' : 'inactive', existingIntegrations[0].id]
      );
      
      res.status(200).json({
        id: existingIntegrations[0].id,
        type: 'hubspot',
        config: { api_key: '***********' }, // Mask API key in response
        status: active ? 'active' : 'inactive',
        message: 'HubSpot integration updated'
      });
    } else {
      // Create new integration
      const integration_id = uuidv4();
      await pool.query(
        'INSERT INTO integrations (id, user_id, type, name, config, status) VALUES (?, ?, ?, ?, ?, ?)',
        [
          integration_id,
          user_id,
          'hubspot',
          'HubSpot',
          JSON.stringify(config),
          active ? 'active' : 'inactive'
        ]
      );
      
      res.status(201).json({
        id: integration_id,
        type: 'hubspot',
        name: 'HubSpot',
        config: { api_key: '***********' }, // Mask API key in response
        status: active ? 'active' : 'inactive',
        message: 'HubSpot integration created'
      });
    }
  } catch (error) {
    console.error('Configure HubSpot error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Delete an integration
exports.deleteIntegration = async (req, res) => {
  try {
    const user_id = req.user.id;
    const integration_id = req.params.id;
    
    // Verify integration belongs to user
    const [integrations] = await pool.query(
      'SELECT id FROM integrations WHERE id = ? AND user_id = ?',
      [integration_id, user_id]
    );
    
    if (integrations.length === 0) {
      return res.status(404).json({ message: 'Integration not found' });
    }
    
    // Delete integration
    await pool.query(
      'DELETE FROM integrations WHERE id = ?',
      [integration_id]
    );
    
    res.status(200).json({
      message: 'Integration deleted successfully'
    });
  } catch (error) {
    console.error('Delete integration error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
