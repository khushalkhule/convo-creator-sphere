
-- Payment orders table for tracking Razorpay orders
CREATE TABLE IF NOT EXISTS payment_orders (
  id VARCHAR(36) PRIMARY KEY,
  user_id VARCHAR(36) NOT NULL,
  plan_id VARCHAR(36) NOT NULL,
  order_id VARCHAR(100) NOT NULL,
  payment_id VARCHAR(100) NULL,
  amount DECIMAL(10, 2) NOT NULL,
  status ENUM('created', 'completed', 'failed') DEFAULT 'created',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  completed_at TIMESTAMP NULL,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (plan_id) REFERENCES subscription_plans(id)
);

-- This ensures the subscription plans have the correct data structure
ALTER TABLE subscription_plans
ADD COLUMN IF NOT EXISTS description TEXT AFTER name,
ADD COLUMN IF NOT EXISTS is_popular BOOLEAN DEFAULT FALSE AFTER features;

-- Ensure we have a free plan in both monthly and yearly intervals
INSERT INTO subscription_plans (id, name, description, price, interval, features, is_popular, chatbot_limit, api_calls_limit, storage_limit)
SELECT UUID(), 'Free', 'Get started with basic features', 0.00, 'monthly', 
   JSON_ARRAY('1 Chatbot', '1,000 API calls/month', '100MB storage'), 
   FALSE, 1, 1000, 100
WHERE NOT EXISTS (
    SELECT 1 FROM subscription_plans 
    WHERE price = 0 AND interval = 'monthly'
);

INSERT INTO subscription_plans (id, name, description, price, interval, features, is_popular, chatbot_limit, api_calls_limit, storage_limit)
SELECT UUID(), 'Free', 'Get started with basic features', 0.00, 'yearly', 
   JSON_ARRAY('1 Chatbot', '1,000 API calls/month', '100MB storage'), 
   FALSE, 1, 1000, 100
WHERE NOT EXISTS (
    SELECT 1 FROM subscription_plans 
    WHERE price = 0 AND interval = 'yearly'
);
