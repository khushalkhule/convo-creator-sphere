
require('dotenv').config();
const mysql = require('mysql2/promise');

const testConnection = async () => {
  try {
    console.log('Attempting to connect to database...');
    
    // Create connection with the same config as in your app
    const connection = await mysql.createConnection({
      host: '82.180.143.240',
      user: 'u264210823_aireplyrdbuser',
      password: 'E9!ui0xjt@Z9',
      database: 'u264210823_aireplyrdb',
    });

    console.log('✅ Database connection successful!');
    
    // Try a simple query to further verify
    const [result] = await connection.query('SHOW TABLES');
    
    console.log('\nTables in database:');
    if (result.length === 0) {
      console.log('No tables found. You may need to run db-init.js');
    } else {
      result.forEach(table => {
        // Get the first value (table name) from each row object
        const tableName = Object.values(table)[0];
        console.log(`- ${tableName}`);
      });
    }
    
    await connection.end();
  } catch (error) {
    console.error('❌ Database connection failed!');
    console.error('Error details:', error.message);
    
    // Give more specific error info based on error code
    if (error.code === 'ECONNREFUSED') {
      console.error('\nThe database server is refusing connections. Possible causes:');
      console.error('- Database server is not running');
      console.error('- Firewall is blocking the connection');
      console.error('- Incorrect host or port');
    } else if (error.code === 'ER_ACCESS_DENIED_ERROR') {
      console.error('\nAccess denied. Possible causes:');
      console.error('- Incorrect username or password');
      console.error('- User does not have access to the database');
    } else if (error.code === 'ER_BAD_DB_ERROR') {
      console.error('\nDatabase does not exist. Please check the database name.');
    }
  }
};

testConnection();
