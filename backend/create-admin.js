
require('dotenv').config();
const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');
const pool = require('./config/db');

const createAdmin = async () => {
  try {
    // Check if admin exists
    const [admins] = await pool.query('SELECT * FROM users WHERE role = ?', ['admin']);
    
    if (admins.length > 0) {
      console.log('Admin user already exists.');
      console.log('Email:', admins[0].email);
      console.log('Name:', admins[0].name);
      return;
    }
    
    const adminId = uuidv4();
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('admin123', salt);
    
    // Insert admin user
    await pool.query(
      'INSERT INTO users (id, name, email, password_hash, role, subscription_tier) VALUES (?, ?, ?, ?, ?, ?)',
      [adminId, 'Admin User', 'admin@example.com', hashedPassword, 'admin', 'enterprise']
    );
    
    console.log('Admin user created successfully:');
    console.log('Email: admin@example.com');
    console.log('Password: admin123');
  } catch (error) {
    console.error('Error creating admin user:', error);
  } finally {
    pool.end();
  }
};

createAdmin();
