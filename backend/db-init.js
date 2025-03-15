
require('dotenv').config();
const mysql = require('mysql2/promise');

const createTables = async () => {
  try {
    // Create connection
    const connection = await mysql.createConnection({
      host: '82.180.143.240',
      user: 'u264210823_aireplyrdbuser',
      password: 'E9!ui0xjt@Z9',
      database: 'u264210823_aireplyrdb',
    });

    console.log('Connected to database');

    // Create Users table
    await connection.query(`
      CREATE TABLE IF NOT EXISTS users (
        id VARCHAR(36) PRIMARY KEY,
        email VARCHAR(255) UNIQUE NOT NULL,
        name VARCHAR(255),
        password_hash VARCHAR(255) NOT NULL,
        role VARCHAR(50) NOT NULL DEFAULT 'client',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        last_login TIMESTAMP,
        profile_image VARCHAR(255),
        is_active BOOLEAN DEFAULT TRUE,
        subscription_tier VARCHAR(50) DEFAULT 'free'
      )
    `);
    console.log('Users table created or already exists');

    // Create Chatbots table
    await connection.query(`
      CREATE TABLE IF NOT EXISTS chatbots (
        id VARCHAR(36) PRIMARY KEY,
        user_id VARCHAR(36),
        name VARCHAR(255) NOT NULL,
        description TEXT,
        status VARCHAR(50) DEFAULT 'draft',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        configuration JSON,
        conversation_count INT DEFAULT 0,
        lead_count INT DEFAULT 0,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
      )
    `);
    console.log('Chatbots table created or already exists');

    // Create Knowledge Base table
    await connection.query(`
      CREATE TABLE IF NOT EXISTS knowledge_base (
        id VARCHAR(36) PRIMARY KEY,
        chatbot_id VARCHAR(36),
        content_type VARCHAR(50) NOT NULL,
        content TEXT NOT NULL,
        source VARCHAR(255),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (chatbot_id) REFERENCES chatbots(id) ON DELETE CASCADE
      )
    `);
    console.log('Knowledge Base table created or already exists');

    // Create Conversations table
    await connection.query(`
      CREATE TABLE IF NOT EXISTS conversations (
        id VARCHAR(36) PRIMARY KEY,
        chatbot_id VARCHAR(36),
        visitor_id VARCHAR(255),
        started_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        ended_at TIMESTAMP,
        message_count INT DEFAULT 0,
        source_url VARCHAR(255),
        user_agent TEXT,
        ip_address VARCHAR(50),
        lead_captured BOOLEAN DEFAULT FALSE,
        FOREIGN KEY (chatbot_id) REFERENCES chatbots(id) ON DELETE CASCADE
      )
    `);
    console.log('Conversations table created or already exists');

    // Create Messages table
    await connection.query(`
      CREATE TABLE IF NOT EXISTS messages (
        id VARCHAR(36) PRIMARY KEY,
        conversation_id VARCHAR(36),
        content TEXT NOT NULL,
        is_bot BOOLEAN NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        attachments JSON,
        metadata JSON,
        FOREIGN KEY (conversation_id) REFERENCES conversations(id) ON DELETE CASCADE
      )
    `);
    console.log('Messages table created or already exists');

    // Create Leads table
    await connection.query(`
      CREATE TABLE IF NOT EXISTS leads (
        id VARCHAR(36) PRIMARY KEY,
        chatbot_id VARCHAR(36),
        conversation_id VARCHAR(36),
        data JSON NOT NULL,
        score INT,
        status VARCHAR(50) DEFAULT 'new',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        tags JSON,
        FOREIGN KEY (chatbot_id) REFERENCES chatbots(id) ON DELETE CASCADE,
        FOREIGN KEY (conversation_id) REFERENCES conversations(id)
      )
    `);
    console.log('Leads table created or already exists');

    await connection.end();
    console.log('All tables created successfully');
  } catch (error) {
    console.error('Error creating tables:', error);
  }
};

createTables();
