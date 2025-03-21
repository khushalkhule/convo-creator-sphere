const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const pool = require('../config/db');
const { v4: uuidv4 } = require('uuid');

// Register a new user
exports.register = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    
    // Validate input
    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Please provide name, email and password' });
    }
    
    console.log('Attempting to register user:', email);
    
    // Check if user already exists
    const [users] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);
    
    if (users.length > 0) {
      console.log('User already exists with email:', email);
      return res.status(400).json({ message: 'User already exists with this email' });
    }
    
    // Generate UUID
    const userId = uuidv4();
    
    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    
    console.log('Inserting new user into database...');
    
    // Insert user with better error handling
    try {
      await pool.query(
        'INSERT INTO users (id, name, email, password_hash, role, subscription_tier) VALUES (?, ?, ?, ?, ?, ?)',
        [userId, name, email, hashedPassword, 'client', 'free']
      );
      
      console.log('User registered successfully:', userId);
      
      res.status(201).json({ message: 'User registered successfully' });
    } catch (dbError) {
      console.error('Database error during user insertion:', dbError.message);
      
      // Check if it's a table-related error
      if (dbError.code === 'ER_NO_SUCH_TABLE') {
        return res.status(500).json({ 
          message: 'Database table missing. Please ensure the users table exists.',
          error: dbError.message
        });
      }
      
      // Check if it's a column-related error
      if (dbError.code === 'ER_BAD_FIELD_ERROR') {
        return res.status(500).json({ 
          message: 'Database schema issue. Please check table structure.',
          error: dbError.message
        });
      }
      
      throw dbError;
    }
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ 
      message: 'Server error during registration', 
      error: error.message 
    });
  }
};

// Login user
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Get user
    const [users] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);
    
    if (users.length === 0) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }
    
    const user = users[0];
    
    // Check password
    const isMatch = await bcrypt.compare(password, user.password_hash);
    
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }
    
    // Update last login
    await pool.query('UPDATE users SET last_login = NOW() WHERE id = ?', [user.id]);
    
    // Create JWT token
    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '24h' }
    );
    
    // Return user without password
    const { password_hash, ...userWithoutPassword } = user;
    
    res.status(200).json({
      token,
      user: userWithoutPassword
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get authenticated user
exports.getMe = async (req, res) => {
  try {
    const [users] = await pool.query(
      'SELECT id, name, email, role, created_at, profile_image, subscription_tier FROM users WHERE id = ?', 
      [req.user.id]
    );
    
    if (users.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    res.status(200).json(users[0]);
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Create admin user
exports.createAdmin = async (req, res) => {
  try {
    // Check if admin exists
    const [admins] = await pool.query('SELECT * FROM users WHERE role = ?', ['admin']);
    
    if (admins.length > 0) {
      return res.status(400).json({ message: 'Admin user already exists' });
    }
    
    const adminId = uuidv4();
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('admin123', salt);
    
    // Insert admin user
    await pool.query(
      'INSERT INTO users (id, name, email, password_hash, role, subscription_tier) VALUES (?, ?, ?, ?, ?, ?)',
      [adminId, 'Admin User', 'admin@example.com', hashedPassword, 'admin', 'enterprise']
    );
    
    res.status(201).json({ message: 'Admin user created successfully' });
  } catch (error) {
    console.error('Create admin error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
