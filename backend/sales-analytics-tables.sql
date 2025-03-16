
-- Sales analytics tables

-- Monthly Revenue table to track revenue over time
CREATE TABLE IF NOT EXISTS monthly_revenue (
  id VARCHAR(36) PRIMARY KEY,
  month VARCHAR(7) NOT NULL, -- Format: YYYY-MM
  total_revenue DECIMAL(10, 2) NOT NULL DEFAULT 0,
  subscription_count INT NOT NULL DEFAULT 0,
  new_customers INT NOT NULL DEFAULT 0,
  churned_customers INT NOT NULL DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Plan Distribution table to track subscription plan distribution
CREATE TABLE IF NOT EXISTS plan_distribution (
  id VARCHAR(36) PRIMARY KEY,
  month VARCHAR(7) NOT NULL, -- Format: YYYY-MM
  plan_id VARCHAR(36) NOT NULL,
  plan_name VARCHAR(100) NOT NULL,
  subscriber_count INT NOT NULL DEFAULT 0,
  revenue DECIMAL(10, 2) NOT NULL DEFAULT 0,
  percentage DECIMAL(5, 2) NOT NULL DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (plan_id) REFERENCES subscription_plans(id)
);

-- Insert sample data for monthly revenue
INSERT INTO monthly_revenue (id, month, total_revenue, subscription_count, new_customers, churned_customers)
VALUES
  (UUID(), '2023-01', 12000.00, 250, 30, 5),
  (UUID(), '2023-02', 18000.00, 280, 35, 5),
  (UUID(), '2023-03', 21000.00, 310, 40, 10),
  (UUID(), '2023-04', 26000.00, 340, 38, 8),
  (UUID(), '2023-05', 29000.00, 360, 30, 10),
  (UUID(), '2023-06', 35000.00, 390, 42, 12);

-- Insert sample data for plan distribution (based on the current month)
INSERT INTO plan_distribution (id, month, plan_id, plan_name, subscriber_count, revenue, percentage)
SELECT 
  UUID(), 
  DATE_FORMAT(NOW(), '%Y-%m'), 
  id, 
  name, 
  FLOOR(RAND() * 100) + 50, 
  (FLOOR(RAND() * 100) + 50) * price, 
  RAND() * 100
FROM subscription_plans
WHERE interval = 'monthly';
