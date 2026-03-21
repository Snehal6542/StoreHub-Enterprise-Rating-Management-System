-- Create database
CREATE DATABASE store_rating_db;

-- Use the database
\c store_rating_db;

-- Create users table
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(60) NOT NULL CHECK (LENGTH(name) >= 20 AND LENGTH(name) <= 60),
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    address VARCHAR(400),
    role VARCHAR(20) DEFAULT 'normal' CHECK (role IN ('admin', 'normal', 'store_owner')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create stores table
CREATE TABLE stores (
    id SERIAL PRIMARY KEY,
    name VARCHAR(60) NOT NULL CHECK (LENGTH(name) >= 20 AND LENGTH(name) <= 60),
    email VARCHAR(255) UNIQUE NOT NULL,
    address VARCHAR(400),
    owner_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create ratings table
CREATE TABLE ratings (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    store_id INTEGER REFERENCES stores(id) ON DELETE CASCADE,
    rating INTEGER CHECK (rating >= 1 AND rating <= 5),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, store_id)
);

-- Create indexes for better performance
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_stores_name ON stores(name);
CREATE INDEX idx_ratings_store_id ON ratings(store_id);
CREATE INDEX idx_ratings_user_id ON ratings(user_id);

-- Insert default admin user (password: Admin123!)
INSERT INTO users (name, email, password, address, role) 
VALUES ('System Administrator User', 'admin@system.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', '123 Admin Street, Admin City', 'admin');

-- Insert sample store owners
INSERT INTO users (name, email, password, address, role) VALUES 
('Store Owner One Sample User', 'owner1@store.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', '456 Store Street, Store City', 'store_owner'),
('Store Owner Two Sample User', 'owner2@store.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', '789 Shop Avenue, Shop Town', 'store_owner');

-- Insert sample stores
INSERT INTO stores (name, email, address, owner_id) VALUES 
('Sample Electronics Store Name', 'electronics@store.com', '123 Electronics Street, Tech City', 2),
('Sample Grocery Store Name Here', 'grocery@store.com', '456 Food Avenue, Market Town', 3);

-- Insert sample normal users
INSERT INTO users (name, email, password, address, role) VALUES 
('Normal User One Sample Name', 'user1@email.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', '321 User Street, User City', 'normal'),
('Normal User Two Sample Name', 'user2@email.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', '654 Customer Avenue, Customer Town', 'normal');

-- Insert sample ratings
INSERT INTO ratings (user_id, store_id, rating) VALUES 
(4, 1, 5),
(5, 1, 4),
(4, 2, 3),
(5, 2, 5);