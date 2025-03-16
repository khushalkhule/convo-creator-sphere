
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
  -- The password_hash field will be properly handled by the backend's bcrypt
  -- Running the create-admin.js script will handle the proper password hashing
  '', 
  'admin', 
  'enterprise', 
  NOW(), 
  true
);

-- Note: Do not execute this SQL directly. Instead, use the provided create-admin.js script
-- Run the script with: node backend/create-admin.js
-- This will properly hash the password before inserting the admin user
