
-- Users table is already created in the initial setup

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

-- Conversations table
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

-- Messages table
CREATE TABLE IF NOT EXISTS messages (
  id VARCHAR(36) PRIMARY KEY,
  conversation_id VARCHAR(36) NOT NULL,
  content TEXT NOT NULL,
  role ENUM('user', 'system', 'assistant') NOT NULL,
  timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (conversation_id) REFERENCES conversations(id) ON DELETE CASCADE
);

-- Leads table
CREATE TABLE IF NOT EXISTS leads (
  id VARCHAR(36) PRIMARY KEY,
  chatbot_id VARCHAR(36) NOT NULL,
  conversation_id VARCHAR(36),
  name VARCHAR(255),
  email VARCHAR(255),
  phone VARCHAR(50),
  message TEXT,
  additional_fields JSON,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (chatbot_id) REFERENCES chatbots(id) ON DELETE CASCADE,
  FOREIGN KEY (conversation_id) REFERENCES conversations(id) ON DELETE SET NULL
);

-- Integrations table
CREATE TABLE IF NOT EXISTS integrations (
  id VARCHAR(36) PRIMARY KEY,
  user_id VARCHAR(36) NOT NULL,
  type ENUM('instagram', 'zapier', 'hubspot', 'slack', 'salesforce', 'mailchimp') NOT NULL,
  name VARCHAR(255),
  config JSON NOT NULL,
  status ENUM('active', 'inactive') DEFAULT 'inactive',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Subscription Plans table
CREATE TABLE IF NOT EXISTS subscription_plans (
  id VARCHAR(36) PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  price DECIMAL(10, 2) NOT NULL,
  chatbot_limit INT DEFAULT 1,
  api_call_limit INT DEFAULT 10000,
  storage_limit INT DEFAULT 1,
  features JSON,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- User Subscriptions table
CREATE TABLE IF NOT EXISTS user_subscriptions (
  id VARCHAR(36) PRIMARY KEY,
  user_id VARCHAR(36) NOT NULL,
  plan_id VARCHAR(36) NOT NULL,
  status ENUM('active', 'cancelled', 'expired') DEFAULT 'active',
  next_billing_date DATE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (plan_id) REFERENCES subscription_plans(id) ON DELETE CASCADE
);

-- Invoices table
CREATE TABLE IF NOT EXISTS invoices (
  id VARCHAR(36) PRIMARY KEY,
  user_id VARCHAR(36) NOT NULL,
  subscription_id VARCHAR(36) NOT NULL,
  invoice_number VARCHAR(50) NOT NULL,
  amount DECIMAL(10, 2) NOT NULL,
  status ENUM('paid', 'pending', 'failed') DEFAULT 'pending',
  billing_date DATE NOT NULL,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (subscription_id) REFERENCES user_subscriptions(id) ON DELETE CASCADE
);

-- Usage Statistics table
CREATE TABLE IF NOT EXISTS usage_statistics (
  id VARCHAR(36) PRIMARY KEY,
  user_id VARCHAR(36) NOT NULL,
  api_calls_used INT DEFAULT 0,
  storage_used DECIMAL(10, 2) DEFAULT 0,
  chatbots_created INT DEFAULT 0,
  last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Analytics Data table for daily stats
CREATE TABLE IF NOT EXISTS analytics_daily (
  id VARCHAR(36) PRIMARY KEY,
  user_id VARCHAR(36) NOT NULL,
  chatbot_id VARCHAR(36) NOT NULL,
  date DATE NOT NULL,
  conversation_count INT DEFAULT 0,
  lead_count INT DEFAULT 0,
  avg_conversation_length FLOAT DEFAULT 0,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (chatbot_id) REFERENCES chatbots(id) ON DELETE CASCADE,
  UNIQUE KEY unique_daily_chatbot_stats (chatbot_id, date)
);
