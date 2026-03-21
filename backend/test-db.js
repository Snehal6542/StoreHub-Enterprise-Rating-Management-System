const { query, queryOne, insert } = require('./src/config/database');

const testDB = async () => {
  try {
    console.log('Testing database connection...');
    
    // Test basic query
    const users = await query('SELECT * FROM users LIMIT 1');
    console.log('Users found:', users.rows?.length || 0);
    
    // Test stores
    const stores = await query('SELECT * FROM stores');
    console.log('Stores found:', stores.rows?.length || 0);
    
    // Test ratings table structure
    const ratings = await query('SELECT * FROM ratings LIMIT 1');
    console.log('Ratings table accessible:', !!ratings);
    
    console.log('Database test completed successfully');
    process.exit(0);
  } catch (error) {
    console.error('Database test failed:', error);
    process.exit(1);
  }
};

testDB();