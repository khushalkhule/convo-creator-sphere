
const pool = require('../config/db');

// Get analytics overview for dashboard
exports.getAnalyticsOverview = async (req, res) => {
  try {
    const user_id = req.user.id;
    
    // Get total conversations
    const [conversations] = await pool.query(
      `SELECT COUNT(*) as total 
       FROM conversations c
       JOIN chatbots b ON c.chatbot_id = b.id
       WHERE b.user_id = ?`,
      [user_id]
    );
    
    // Get total leads
    const [leads] = await pool.query(
      `SELECT COUNT(*) as total 
       FROM leads l
       JOIN chatbots b ON l.chatbot_id = b.id
       WHERE b.user_id = ?`,
      [user_id]
    );
    
    // Get total chatbots
    const [chatbots] = await pool.query(
      'SELECT COUNT(*) as total FROM chatbots WHERE user_id = ?',
      [user_id]
    );
    
    // Calculate conversion rate
    const totalConversations = conversations[0].total;
    const totalLeads = leads[0].total;
    const conversionRate = totalConversations > 0 
      ? Math.round((totalLeads / totalConversations) * 100) 
      : 0;
    
    // Get daily conversation data for the past week
    const [dailyData] = await pool.query(
      `SELECT 
         DATE_FORMAT(a.date, '%a') as day,
         SUM(a.conversation_count) as count
       FROM analytics_daily a
       JOIN chatbots b ON a.chatbot_id = b.id
       WHERE b.user_id = ? AND a.date >= DATE_SUB(CURRENT_DATE, INTERVAL 7 DAY)
       GROUP BY a.date
       ORDER BY a.date ASC`,
      [user_id]
    );
    
    // If no data exists, provide sample data for UI development
    let conversationTrends = dailyData;
    if (conversationTrends.length === 0) {
      conversationTrends = [
        { day: 'Mon', count: 32 },
        { day: 'Tue', count: 42 },
        { day: 'Wed', count: 58 },
        { day: 'Thu', count: 63 },
        { day: 'Fri', count: 51 },
        { day: 'Sat', count: 26 },
        { day: 'Sun', count: 22 }
      ];
    }
    
    res.status(200).json({
      total_conversations: totalConversations,
      total_leads: totalLeads,
      total_chatbots: chatbots[0].total,
      conversion_rate: conversionRate,
      conversation_trends: conversationTrends
    });
  } catch (error) {
    console.error('Get analytics overview error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get detailed analytics for the Analytics page
exports.getDetailedAnalytics = async (req, res) => {
  try {
    const user_id = req.user.id;
    const { period = 'week', chatbot_id } = req.query;
    
    // Determine date range based on period
    let dateInterval;
    switch(period) {
      case 'day':
        dateInterval = 'INTERVAL 1 DAY';
        break;
      case 'month':
        dateInterval = 'INTERVAL 30 DAY';
        break;
      case 'year':
        dateInterval = 'INTERVAL 365 DAY';
        break;
      default: // week
        dateInterval = 'INTERVAL 7 DAY';
    }
    
    // Build base query
    let query = `
      SELECT 
        DATE_FORMAT(a.date, '%Y-%m-%d') as date,
        SUM(a.conversation_count) as conversation_count,
        SUM(a.lead_count) as lead_count
      FROM analytics_daily a
      JOIN chatbots b ON a.chatbot_id = b.id
      WHERE b.user_id = ? AND a.date >= DATE_SUB(CURRENT_DATE, ${dateInterval})
    `;
    
    let params = [user_id];
    
    // Add chatbot filter if provided
    if (chatbot_id) {
      query += ' AND a.chatbot_id = ?';
      params.push(chatbot_id);
    }
    
    // Group and order
    query += ' GROUP BY a.date ORDER BY a.date ASC';
    
    const [results] = await pool.query(query, params);
    
    // If no data exists, provide sample data for UI development
    let analyticsData;
    if (results.length === 0) {
      // Generate sample data
      analyticsData = generateSampleAnalyticsData(period);
    } else {
      analyticsData = results;
    }
    
    res.status(200).json(analyticsData);
  } catch (error) {
    console.error('Get detailed analytics error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Helper function to generate sample analytics data
function generateSampleAnalyticsData(period) {
  const data = [];
  let days;
  
  switch(period) {
    case 'day':
      days = 1;
      break;
    case 'month':
      days = 30;
      break;
    case 'year':
      days = 365;
      break;
    default: // week
      days = 7;
  }
  
  // Generate a date for each day in the period
  for (let i = 0; i < days; i++) {
    const date = new Date();
    date.setDate(date.getDate() - days + i + 1);
    
    data.push({
      date: date.toISOString().split('T')[0],
      conversation_count: Math.floor(Math.random() * 50) + 10,
      lead_count: Math.floor(Math.random() * 20) + 5
    });
  }
  
  return data;
}
