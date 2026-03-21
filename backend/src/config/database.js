const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const bcrypt = require('bcryptjs');

const dbPath = path.join(__dirname, '../../store_rating.db');
const db = new sqlite3.Database(dbPath);

const query = (sql, params = []) => {
  return new Promise((resolve, reject) => {
    db.all(sql, params, (err, rows) => {
      if (err) reject(err);
      else resolve({ rows });
    });
  });
};

const queryOne = (sql, params = []) => {
  return new Promise((resolve, reject) => {
    db.get(sql, params, (err, row) => {
      if (err) reject(err);
      else resolve({ data: row, error: null });
    });
  });
};

const insert = (sql, params = []) => {
  return new Promise((resolve, reject) => {
    db.run(sql, params, function(err) {
      if (err) reject(err);
      else resolve({ data: { id: this.lastID }, error: null });
    });
  });
};

const update = (sql, params = []) => {
  return new Promise((resolve, reject) => {
    db.run(sql, params, function(err) {
      if (err) reject(err);
      else resolve({ data: { changes: this.changes }, error: null });
    });
  });
};

const initializeDatabase = async () => {
  try {
    await query(`
      CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name VARCHAR(60) NOT NULL CHECK (length(name) BETWEEN 20 AND 60),
        email VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        address VARCHAR(400),
        role VARCHAR(20) DEFAULT 'normal' CHECK (role IN ('admin', 'normal', 'store_owner')),
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    await query(`
      CREATE TABLE IF NOT EXISTS stores (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name VARCHAR(60) NOT NULL CHECK (length(name) BETWEEN 20 AND 60),
        email VARCHAR(255) UNIQUE NOT NULL,
        address VARCHAR(400),
        owner_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    await query(`
      CREATE TABLE IF NOT EXISTS ratings (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        store_id INTEGER REFERENCES stores(id) ON DELETE CASCADE,
        rating INTEGER NOT NULL CHECK (rating BETWEEN 1 AND 5),
        review TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(user_id, store_id)
      )
    `);

    const adminCheck = await queryOne('SELECT id FROM users WHERE email = ?', ['admin@system.com']);
    
    if (!adminCheck.data) {
      const hashedPassword = await bcrypt.hash('Admin123!', 10);
      await insert(`INSERT INTO users (name, email, password, address, role) VALUES (?, ?, ?, ?, ?)`, 
        ['System Administrator User', 'admin@system.com', hashedPassword, '123 Admin Street, Admin City', 'admin']);
      
      // Create dummy data
      const ownerPassword = await bcrypt.hash('Admin123!', 10);
      const userPassword = await bcrypt.hash('User123!', 10);
      
      const owner1 = await insert(`INSERT INTO users (name, email, password, address, role) VALUES (?, ?, ?, ?, ?)`, 
        ['Tech Store Owner John Smith Account', 'john@techstore.com', ownerPassword, '123 Silicon Valley Blvd, San Francisco, CA', 'store_owner']);
      
      const owner2 = await insert(`INSERT INTO users (name, email, password, address, role) VALUES (?, ?, ?, ?, ?)`, 
        ['Fashion Boutique Owner Sarah Johnson', 'sarah@fashionboutique.com', ownerPassword, '456 Fashion District, New York, NY', 'store_owner']);
      
      const user1 = await insert(`INSERT INTO users (name, email, password, address, role) VALUES (?, ?, ?, ?, ?)`, 
        ['Customer Alice Johnson Account', 'alice@customer.com', userPassword, '111 Customer Street, Los Angeles, CA', 'normal']);
      
      const user2 = await insert(`INSERT INTO users (name, email, password, address, role) VALUES (?, ?, ?, ?, ?)`, 
        ['Customer Bob Wilson Account User', 'bob@customer.com', userPassword, '222 Buyer Avenue, Chicago, IL', 'normal']);
      
      const store1 = await insert(`INSERT INTO stores (name, email, address, owner_id) VALUES (?, ?, ?, ?)`, 
        ['TechWorld Electronics Superstore', 'contact@techworld.com', '123 Silicon Valley Blvd, San Francisco, CA 94105', owner1.data.id]);
      
      const store2 = await insert(`INSERT INTO stores (name, email, address, owner_id) VALUES (?, ?, ?, ?)`, 
        ['Elegant Fashion Boutique Store', 'info@elegantfashion.com', '456 Fashion District, New York, NY 10001', owner2.data.id]);
      
      await insert(`INSERT INTO ratings (user_id, store_id, rating, review) VALUES (?, ?, ?, ?)`, 
        [user1.data.id, store1.data.id, 5, 'Amazing selection of electronics! Great customer service and competitive prices.']);
      
      await insert(`INSERT INTO ratings (user_id, store_id, rating, review) VALUES (?, ?, ?, ?)`, 
        [user2.data.id, store1.data.id, 4, 'Good store with latest gadgets. Staff is knowledgeable.']);
      
      await insert(`INSERT INTO ratings (user_id, store_id, rating, review) VALUES (?, ?, ?, ?)`, 
        [user1.data.id, store2.data.id, 4, 'Beautiful clothing collection. Trendy styles but prices are high.']);
      
      console.log('✅ Created dummy data with stores, users, and reviews');
    }



    console.log('✅ Database initialized successfully');
  } catch (error) {
    console.error('❌ Database initialization failed:', error);
  }
};

initializeDatabase();

module.exports = { query, queryOne, insert, update };