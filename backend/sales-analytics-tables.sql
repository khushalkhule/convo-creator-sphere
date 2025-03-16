
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

-- Clear existing data for testing
DELETE FROM monthly_revenue;
DELETE FROM plan_distribution;

-- Insert sample data for monthly revenue for the current year
INSERT INTO monthly_revenue (id, month, total_revenue, subscription_count, new_customers, churned_customers)
VALUES
  (UUID(), '2023-07', 12000.00, 250, 30, 5),
  (UUID(), '2023-08', 18000.00, 280, 35, 5),
  (UUID(), '2023-09', 21000.00, 310, 40, 10),
  (UUID(), '2023-10', 26000.00, 340, 38, 8),
  (UUID(), '2023-11', 29000.00, 360, 30, 10),
  (UUID(), '2023-12', 35000.00, 390, 42, 12),
  (UUID(), '2024-01', 38000.00, 420, 45, 15),
  (UUID(), '2024-02', 42000.00, 450, 48, 18),
  (UUID(), '2024-03', 47000.00, 480, 50, 20),
  (UUID(), '2024-04', 52000.00, 510, 55, 25),
  (UUID(), '2024-05', 58000.00, 540, 60, 30),
  (UUID(), '2024-06', 64000.00, 570, 65, 35);

-- Insert sample data for current month plan distribution
INSERT INTO plan_distribution (id, month, plan_id, plan_name, subscriber_count, revenue, percentage)
SELECT 
  UUID(), 
  DATE_FORMAT(NOW(), '%Y-%m'), 
  id, 
  name, 
  FLOOR(RAND() * 100) + 50, 
  (FLOOR(RAND() * 100) + 50) * price, 
  0 -- We'll update this later
FROM subscription_plans
WHERE interval = 'monthly';

-- Update percentages in plan_distribution
SET @total_subscribers = (SELECT SUM(subscriber_count) FROM plan_distribution WHERE month = DATE_FORMAT(NOW(), '%Y-%m'));

UPDATE plan_distribution 
SET percentage = (subscriber_count / @total_subscribers) * 100
WHERE month = DATE_FORMAT(NOW(), '%Y-%m');

-- Insert admin user for testing if not exists
INSERT INTO users (id, name, email, password_hash, role, created_at, is_active)
SELECT UUID(), 'Administrator', 'admin@example.com', '$2a$10$6RsAv7NZZXGfzc.3IKAOj.qlvWL6F1h5LiGJ0Hd7Pu.ACxqM5wJUu', 'admin', NOW(), 1
FROM dual
WHERE NOT EXISTS (SELECT 1 FROM users WHERE email = 'admin@example.com');
