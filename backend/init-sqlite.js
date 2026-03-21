const sqlite3 = require('sqlite3').verbose();
const bcrypt = require('bcryptjs');
const path = require('path');

const dbPath = path.join(__dirname, 'store_rating.db');
const db = new sqlite3.Database(dbPath);

async function initDatabase() {
  const hashedPassword = await bcrypt.hash('Admin123!', 10);
  
  db.serialize(() => {
    // Create tables
    db.run(`CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL CHECK (LENGTH(name) >= 20 AND LENGTH(name) <= 60),
      email TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      address TEXT,
      role TEXT DEFAULT 'normal' CHECK (role IN ('admin', 'normal', 'store_owner')),
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )`);

    db.run(`CREATE TABLE IF NOT EXISTS stores (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL CHECK (LENGTH(name) >= 20 AND LENGTH(name) <= 60),
      email TEXT UNIQUE NOT NULL,
      address TEXT,
      owner_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )`);

    db.run(`CREATE TABLE IF NOT EXISTS ratings (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
      store_id INTEGER REFERENCES stores(id) ON DELETE CASCADE,
      rating INTEGER CHECK (rating >= 1 AND rating <= 5),
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      UNIQUE(user_id, store_id)
    )`);

    // Insert sample data
    db.run(`INSERT OR IGNORE INTO users (name, email, password, address, role) VALUES 
      ('System Administrator User', 'admin@system.com', ?, '123 Admin Street, Admin City', 'admin')`, [hashedPassword]);

    db.run(`INSERT OR IGNORE INTO users (name, email, password, address, role) VALUES 
      ('Store Owner One Sample User', 'owner1@store.com', ?, '456 Store Street, Store City', 'store_owner')`, [hashedPassword]);

    db.run(`INSERT OR IGNORE INTO users (name, email, password, address, role) VALUES 
      ('Store Owner Two Sample User', 'owner2@store.com', ?, '789 Shop Avenue, Shop Town', 'store_owner')`, [hashedPassword]);

    db.run(`INSERT OR IGNORE INTO stores (name, email, address, owner_id) VALUES 
      ('Sample Electronics Store Name', 'electronics@store.com', '123 Electronics Street, Tech City', 2)`);

    db.run(`INSERT OR IGNORE INTO stores (name, email, address, owner_id) VALUES 
      ('Sample Grocery Store Name Here', 'grocery@store.com', '456 Food Avenue, Market Town', 3)`);

    db.run(`INSERT OR IGNORE INTO users (name, email, password, address, role) VALUES 
      ('Normal User One Sample Name', 'user1@email.com', ?, '321 User Street, User City', 'normal')`, [hashedPassword]);

    db.run(`INSERT OR IGNORE INTO users (name, email, password, address, role) VALUES 
      ('Normal User Two Sample Name', 'user2@email.com', ?, '654 Customer Avenue, Customer Town', 'normal')`, [hashedPassword]);

    console.log('✅ SQLite database initialized successfully');
  });

  db.close();
}

initDatabase().catch(console.error);