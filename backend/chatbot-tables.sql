
-- Teams table
CREATE TABLE IF NOT EXISTS teams (
  id VARCHAR(36) PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  user_id VARCHAR(36) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Chatbots table
CREATE TABLE IF NOT EXISTS chatbots (
  id VARCHAR(36) PRIMARY KEY,
  user_id VARCHAR(36) NOT NULL,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  website_url VARCHAR(255),
  team_id VARCHAR(36),
  status ENUM('draft', 'active', 'paused') DEFAULT 'draft',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (team_id) REFERENCES teams(id) ON DELETE SET NULL
);

-- Chatbot Configuration table
CREATE TABLE IF NOT EXISTS chatbot_configurations (
  id VARCHAR(36) PRIMARY KEY,
  chatbot_id VARCHAR(36) NOT NULL,
  knowledge_base JSON,
  ai_model VARCHAR(50) DEFAULT 'gpt-4o-mini',
  temperature FLOAT DEFAULT 0.7,
  max_tokens INT DEFAULT 2000,
  initial_message TEXT DEFAULT 'Hi there! How can I help you today?',
  suggested_messages JSON,
  theme VARCHAR(50) DEFAULT 'light',
  display_name VARCHAR(255) DEFAULT 'AI Assistant',
  footer_links JSON,
  user_message_color VARCHAR(20) DEFAULT '#0284c7',
  auto_open_delay INT DEFAULT 0,
  input_placeholder VARCHAR(255) DEFAULT 'Type your message here...',
  lead_form_enabled BOOLEAN DEFAULT true,
  lead_form_title VARCHAR(255) DEFAULT 'Get in Touch',
  lead_form_description TEXT,
  lead_form_success_message TEXT,
  lead_form_fields JSON,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (chatbot_id) REFERENCES chatbots(id) ON DELETE CASCADE
);

-- Knowledge Base table for storing training data
CREATE TABLE IF NOT EXISTS knowledge_base (
  id VARCHAR(36) PRIMARY KEY,
  chatbot_id VARCHAR(36) NOT NULL,
  content_type VARCHAR(50) NOT NULL,
  content TEXT NOT NULL,
  source VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (chatbot_id) REFERENCES chatbots(id) ON DELETE CASCADE
);

-- Conversations table for storing chat history
CREATE TABLE IF NOT EXISTS conversations (
  id VARCHAR(36) PRIMARY KEY,
  chatbot_id VARCHAR(36) NOT NULL,
  visitor_id VARCHAR(255),
  started_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  ended_at TIMESTAMP NULL,
  message_count INT DEFAULT 0,
  source_url VARCHAR(255),
  FOREIGN KEY (chatbot_id) REFERENCES chatbots(id) ON DELETE CASCADE
);

-- Messages table for storing individual messages
CREATE TABLE IF NOT EXISTS messages (
  id VARCHAR(36) PRIMARY KEY,
  conversation_id VARCHAR(36) NOT NULL,
  content TEXT NOT NULL,
  role ENUM('user', 'system', 'assistant') NOT NULL,
  timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (conversation_id) REFERENCES conversations(id) ON DELETE CASCADE
);

-- Usage Statistics table for tracking chatbot usage
CREATE TABLE IF NOT EXISTS usage_statistics (
  id VARCHAR(36) PRIMARY KEY,
  user_id VARCHAR(36) NOT NULL,
  api_calls_used INT DEFAULT 0,
  storage_used DECIMAL(10, 2) DEFAULT 0,
  chatbots_created INT DEFAULT 0,
  last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Subscription Plans table
CREATE TABLE IF NOT EXISTS subscription_plans (
  id VARCHAR(36) PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  description TEXT,
  price DECIMAL(10, 2) NOT NULL,
  interval ENUM('monthly', 'yearly') NOT NULL,
  features JSON NOT NULL,
  is_popular BOOLEAN DEFAULT FALSE,
  chatbot_limit INT DEFAULT 1,
  api_calls_limit INT DEFAULT 1000,
  storage_limit INT DEFAULT 100,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- User Subscriptions table
CREATE TABLE IF NOT EXISTS user_subscriptions (
  id VARCHAR(36) PRIMARY KEY,
  user_id VARCHAR(36) NOT NULL,
  plan_id VARCHAR(36) NOT NULL,
  status ENUM('active', 'canceled', 'expired') DEFAULT 'active',
  current_period_start TIMESTAMP NOT NULL,
  current_period_end TIMESTAMP NOT NULL,
  cancel_at_period_end BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (plan_id) REFERENCES subscription_plans(id)
);

-- Insert default subscription plans
DELETE FROM subscription_plans;

INSERT INTO subscription_plans (id, name, description, price, interval, features, is_popular, chatbot_limit, api_calls_limit, storage_limit)
VALUES
  (UUID(), 'Free', 'Get started with basic features', 0.00, 'monthly', 
   JSON_ARRAY('1 Chatbot', '1,000 API calls/month', '100MB storage'), 
   FALSE, 1, 1000, 100),
   
  (UUID(), 'Pro', 'Perfect for growing businesses', 49.99, 'monthly', 
   JSON_ARRAY('5 Chatbots', '50,000 API calls/month', '5GB storage', 'Advanced customization', 'Priority support'), 
   TRUE, 5, 50000, 5000),
   
  (UUID(), 'Enterprise', 'For large organizations', 199.99, 'monthly', 
   JSON_ARRAY('Unlimited Chatbots', 'Unlimited API calls', 'Unlimited storage', 'White labeling', 'Custom AI models', 'Dedicated support', 'SSO'), 
   FALSE, 999, 999999, 999999),
   
  (UUID(), 'Free', 'Get started with basic features', 0.00, 'yearly', 
   JSON_ARRAY('1 Chatbot', '1,000 API calls/month', '100MB storage'), 
   FALSE, 1, 1000, 100),
   
  (UUID(), 'Pro', 'Perfect for growing businesses', 499.99, 'yearly', 
   JSON_ARRAY('5 Chatbots', '50,000 API calls/month', '5GB storage', 'Advanced customization', 'Priority support', '2 months free'), 
   TRUE, 5, 50000, 5000),
   
  (UUID(), 'Enterprise', 'For large organizations', 1999.99, 'yearly', 
   JSON_ARRAY('Unlimited Chatbots', 'Unlimited API calls', 'Unlimited storage', 'White labeling', 'Custom AI models', 'Dedicated support', 'SSO', '2 months free'), 
   FALSE, 999, 999999, 999999);
