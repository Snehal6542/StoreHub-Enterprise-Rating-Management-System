const bcrypt = require('bcryptjs');
const { query, queryOne, insert } = require('./src/config/database');

const initDB = async () => {
  try {
    console.log('Checking admin user...');
    const adminCheck = await queryOne('SELECT id FROM users WHERE email = ?', ['admin@system.com']);
    
    if (!adminCheck.data) {
      console.log('Creating admin user...');
      const hashedPassword = await bcrypt.hash('Admin123!', 10);
      await insert(
        'INSERT INTO users (name, email, password, address, role) VALUES (?, ?, ?, ?, ?)',
        ['System Administrator User', 'admin@system.com', hashedPassword, '123 Admin Street, Admin City', 'admin']
      );
      console.log('✅ Admin user created successfully');
    } else {
      console.log('✅ Admin user already exists');
    }
    
    // Test login
    const user = await queryOne('SELECT * FROM users WHERE email = ?', ['admin@system.com']);
    console.log('Admin user data:', user.data);
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
};

initDB();