
-- SQL query to insert admin credentials
-- This will insert a new admin user with the email 'admin@example.com' and password 'admin123'
-- The password is hashed using bcrypt which is handled in the backend

INSERT INTO users (
  id, 
  name, 
  email, 
  password_hash, 
  role, 
  subscription_tier, 
  created_at, 
  is_active
) 
VALUES (
  UUID(), 
  'Administrator', 
  'admin@example.com', 
  '$2a$10$6RsAv7NZZXGfzc.3IKAOj.qlvWL6F1h5LiGJ0Hd7Pu.ACxqM5wJUu', -- this is the hashed value of "admin123"
  'admin', 
  'enterprise', 
  NOW(), 
  true
);

-- Note: While this SQL works directly, we recommend using the provided create-admin.js script
-- Run the script with: node backend/create-admin.js
-- This will properly hash the password before inserting the admin user

-- Insert sample data for sales analytics if not already present
INSERT INTO monthly_revenue (id, month, total_revenue, subscription_count, new_customers, churned_customers)
SELECT 
  UUID(), '2023-01', 12000.00, 250, 30, 5
WHERE NOT EXISTS (SELECT 1 FROM monthly_revenue WHERE month = '2023-01');

INSERT INTO monthly_revenue (id, month, total_revenue, subscription_count, new_customers, churned_customers)
SELECT 
  UUID(), '2023-02', 18000.00, 280, 35, 5
WHERE NOT EXISTS (SELECT 1 FROM monthly_revenue WHERE month = '2023-02');

INSERT INTO monthly_revenue (id, month, total_revenue, subscription_count, new_customers, churned_customers)
SELECT 
  UUID(), '2023-03', 21000.00, 310, 40, 10
WHERE NOT EXISTS (SELECT 1 FROM monthly_revenue WHERE month = '2023-03');

INSERT INTO monthly_revenue (id, month, total_revenue, subscription_count, new_customers, churned_customers)
SELECT 
  UUID(), '2023-04', 26000.00, 340, 38, 8
WHERE NOT EXISTS (SELECT 1 FROM monthly_revenue WHERE month = '2023-04');

INSERT INTO monthly_revenue (id, month, total_revenue, subscription_count, new_customers, churned_customers)
SELECT 
  UUID(), '2023-05', 29000.00, 360, 30, 10
WHERE NOT EXISTS (SELECT 1 FROM monthly_revenue WHERE month = '2023-05');

INSERT INTO monthly_revenue (id, month, total_revenue, subscription_count, new_customers, churned_customers)
SELECT 
  UUID(), '2023-06', 35000.00, 390, 42, 12
WHERE NOT EXISTS (SELECT 1 FROM monthly_revenue WHERE month = '2023-06');
