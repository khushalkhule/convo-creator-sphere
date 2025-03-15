
const pool = require('../config/db');
const { v4: uuidv4 } = require('uuid');

// Get all leads for a user
exports.getLeads = async (req, res) => {
  try {
    const user_id = req.user.id;
    const { chatbot_id, search, limit = 100, offset = 0 } = req.query;
    
    // Start building the base query
    let query = `
      SELECT 
        l.id, 
        l.name, 
        l.email, 
        l.phone, 
        l.message, 
        l.created_at, 
        l.additional_fields,
        b.name as chatbot_name
      FROM leads l
      JOIN chatbots b ON l.chatbot_id = b.id
      WHERE b.user_id = ?
    `;
    
    let params = [user_id];
    
    // Add filters if provided
    if (chatbot_id) {
      query += ' AND l.chatbot_id = ?';
      params.push(chatbot_id);
    }
    
    if (search) {
      query += ' AND (l.name LIKE ? OR l.email LIKE ? OR l.message LIKE ?)';
      const searchTerm = `%${search}%`;
      params.push(searchTerm, searchTerm, searchTerm);
    }
    
    // Add order by and pagination
    query += ' ORDER BY l.created_at DESC LIMIT ? OFFSET ?';
    params.push(parseInt(limit), parseInt(offset));
    
    const [leads] = await pool.query(query, params);
    
    // Count total leads for pagination info
    let countQuery = `
      SELECT COUNT(*) as total
      FROM leads l
      JOIN chatbots b ON l.chatbot_id = b.id
      WHERE b.user_id = ?
    `;
    
    let countParams = [user_id];
    
    if (chatbot_id) {
      countQuery += ' AND l.chatbot_id = ?';
      countParams.push(chatbot_id);
    }
    
    if (search) {
      countQuery += ' AND (l.name LIKE ? OR l.email LIKE ? OR l.message LIKE ?)';
      const searchTerm = `%${search}%`;
      countParams.push(searchTerm, searchTerm, searchTerm);
    }
    
    const [totalResult] = await pool.query(countQuery, countParams);
    const total = totalResult[0].total;
    
    // Format response
    const formattedLeads = leads.map(lead => ({
      id: lead.id,
      name: lead.name,
      email: lead.email,
      phone: lead.phone,
      message: lead.message,
      chatbot: lead.chatbot_name,
      date: lead.created_at,
      additional_fields: lead.additional_fields ? JSON.parse(lead.additional_fields) : {}
    }));
    
    // If no leads exist, provide sample data for UI development
    if (formattedLeads.length === 0) {
      const sampleLeads = [
        {
          id: uuidv4(),
          name: 'John Doe',
          email: 'john.doe@example.com',
          message: 'I need help with integrating the chatbot on my website',
          chatbot: 'Unknown Chatbot',
          date: '2023-06-10T00:00:00Z'
        },
        {
          id: uuidv4(),
          name: 'Jane Smith',
          email: 'jane.smith@example.com',
          message: 'How do I customize the chatbot appearance?',
          chatbot: 'Unknown Chatbot',
          date: '2023-06-12T00:00:00Z'
        },
        {
          id: uuidv4(),
          name: 'Mike Johnson',
          email: 'mike.johnson@example.com',
          message: 'I\'m interested in your pricing plans',
          chatbot: 'Unknown Chatbot',
          date: '2023-06-15T00:00:00Z'
        },
        {
          id: uuidv4(),
          name: 'Sarah Williams',
          email: 'sarah.williams@example.com',
          message: 'Can I integrate this with my Shopify store?',
          chatbot: 'Unknown Chatbot',
          date: '2023-06-18T00:00:00Z'
        },
        {
          id: uuidv4(),
          name: 'David Brown',
          email: 'david.brown@example.com',
          message: 'Looking for AI chatbot solutions',
          chatbot: 'Unknown Chatbot',
          date: '2023-06-20T00:00:00Z'
        }
      ];
      
      res.status(200).json({
        leads: sampleLeads,
        pagination: {
          total: sampleLeads.length,
          offset: 0,
          limit: sampleLeads.length
        }
      });
    } else {
      res.status(200).json({
        leads: formattedLeads,
        pagination: {
          total,
          offset: parseInt(offset),
          limit: parseInt(limit)
        }
      });
    }
  } catch (error) {
    console.error('Get leads error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Create a new lead (typically called from the chatbot widget)
exports.createLead = async (req, res) => {
  try {
    const { 
      chatbot_id, 
      conversation_id, 
      name, 
      email, 
      phone, 
      message,
      additional_fields
    } = req.body;
    
    // Verify chatbot exists
    const [chatbots] = await pool.query(
      'SELECT id FROM chatbots WHERE id = ?',
      [chatbot_id]
    );
    
    if (chatbots.length === 0) {
      return res.status(404).json({ message: 'Chatbot not found' });
    }
    
    // Create new lead
    const leadId = uuidv4();
    await pool.query(
      `INSERT INTO leads 
         (id, chatbot_id, conversation_id, name, email, phone, message, additional_fields) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        leadId, 
        chatbot_id, 
        conversation_id || null, 
        name, 
        email, 
        phone || null, 
        message || null,
        additional_fields ? JSON.stringify(additional_fields) : null
      ]
    );
    
    // Update analytics data
    const today = new Date().toISOString().split('T')[0];
    
    // Check if we have an entry for today
    const [analytics] = await pool.query(
      `SELECT id FROM analytics_daily 
       WHERE chatbot_id = ? AND date = ?`,
      [chatbot_id, today]
    );
    
    if (analytics.length === 0) {
      // Create new analytics entry
      const analyticsId = uuidv4();
      const [chatbotResult] = await pool.query(
        'SELECT user_id FROM chatbots WHERE id = ?',
        [chatbot_id]
      );
      
      await pool.query(
        `INSERT INTO analytics_daily 
           (id, user_id, chatbot_id, date, lead_count) 
         VALUES (?, ?, ?, ?, 1)`,
        [analyticsId, chatbotResult[0].user_id, chatbot_id, today]
      );
    } else {
      // Update existing analytics entry
      await pool.query(
        `UPDATE analytics_daily 
         SET lead_count = lead_count + 1 
         WHERE id = ?`,
        [analytics[0].id]
      );
    }
    
    res.status(201).json({
      id: leadId,
      message: 'Lead created successfully'
    });
  } catch (error) {
    console.error('Create lead error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Export leads as CSV
exports.exportLeads = async (req, res) => {
  try {
    const user_id = req.user.id;
    const { chatbot_id } = req.query;
    
    // Build query
    let query = `
      SELECT 
        l.name, 
        l.email, 
        l.phone, 
        l.message, 
        DATE_FORMAT(l.created_at, '%Y-%m-%d %H:%i:%s') as created_at,
        b.name as chatbot_name
      FROM leads l
      JOIN chatbots b ON l.chatbot_id = b.id
      WHERE b.user_id = ?
    `;
    
    let params = [user_id];
    
    if (chatbot_id) {
      query += ' AND l.chatbot_id = ?';
      params.push(chatbot_id);
    }
    
    query += ' ORDER BY l.created_at DESC';
    
    const [leads] = await pool.query(query, params);
    
    // Format as CSV
    // In a real implementation, we'd use a proper CSV library
    let csv = 'Name,Email,Phone,Message,Date,Chatbot\n';
    
    leads.forEach(lead => {
      // Escape fields with quotes if they contain commas
      const escapeCsv = (field) => {
        if (!field) return '';
        const str = String(field).replace(/"/g, '""');
        return str.includes(',') ? `"${str}"` : str;
      };
      
      csv += `${escapeCsv(lead.name)},${escapeCsv(lead.email)},${escapeCsv(lead.phone)},${escapeCsv(lead.message)},${lead.created_at},${escapeCsv(lead.chatbot_name)}\n`;
    });
    
    // Set headers for file download
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename=leads.csv');
    
    res.status(200).send(csv);
  } catch (error) {
    console.error('Export leads error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
