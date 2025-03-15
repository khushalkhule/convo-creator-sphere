
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { v4: uuidv4 } = require('uuid');

// Route imports
const authRoutes = require('./routes/authRoutes');
const chatbotRoutes = require('./routes/chatbotRoutes');
const chatbotWizardRoutes = require('./routes/chatbotWizardRoutes');
const analyticsRoutes = require('./routes/analyticsRoutes');
const leadRoutes = require('./routes/leadRoutes');
const integrationRoutes = require('./routes/integrationRoutes');
const subscriptionRoutes = require('./routes/subscriptionRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/chatbots', chatbotRoutes);
app.use('/api/wizard', chatbotWizardRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/leads', leadRoutes);
app.use('/api/integrations', integrationRoutes);
app.use('/api/subscription', subscriptionRoutes);

// Health check route
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK', timestamp: new Date() });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
