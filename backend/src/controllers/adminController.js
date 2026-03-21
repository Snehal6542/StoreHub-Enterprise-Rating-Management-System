const bcrypt = require('bcryptjs');
const { validationResult } = require('express-validator');
const { query, queryOne, insert } = require('../config/database');

const getDashboard = async (req, res) => {
  try {
    console.log('Getting dashboard stats...');
    
    const usersCount = await queryOne('SELECT COUNT(*) as count FROM users');
    const storesCount = await queryOne('SELECT COUNT(*) as count FROM stores');
    const ratingsCount = await queryOne('SELECT COUNT(*) as count FROM ratings');

    console.log('Stats:', {
      users: usersCount.data?.count,
      stores: storesCount.data?.count,
      ratings: ratingsCount.data?.count
    });

    res.json({
      totalUsers: parseInt(usersCount.data?.count || 0),
      totalStores: parseInt(storesCount.data?.count || 0),
      totalRatings: parseInt(ratingsCount.data?.count || 0)
    });
  } catch (error) {
    console.error('Dashboard error:', error);
    res.status(500).json({ message: 'Server error: ' + error.message });
  }
};

const addUser = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { name, email, password, address, role } = req.body;

  try {
    const userExists = await queryOne('SELECT id FROM users WHERE email = ?', [email]);
    if (userExists.data) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const result = await insert(
      'INSERT INTO users (name, email, password, address, role) VALUES (?, ?, ?, ?, ?)',
      [name, email, hashedPassword, address, role]
    );

    const newUser = await queryOne('SELECT id, name, email, address, role FROM users WHERE id = ?', [result.data.id]);
    res.status(201).json(newUser.data);
  } catch (error) {
    console.error('Add user error:', error);
    res.status(500).json({ message: 'Server error: ' + error.message });
  }
};

const addStore = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { name, email, address, owner_id } = req.body;

  try {
    const result = await insert(
      'INSERT INTO stores (name, email, address, owner_id) VALUES (?, ?, ?, ?)',
      [name, email, address, owner_id]
    );

    const newStore = await queryOne('SELECT * FROM stores WHERE id = ?', [result.data.id]);
    res.status(201).json(newStore.data);
  } catch (error) {
    console.error('Add store error:', error);
    res.status(500).json({ message: 'Server error: ' + error.message });
  }
};

const getUsers = async (req, res) => {
  try {
    const result = await query('SELECT id, name, email, address, role FROM users');
    res.json(result.rows || []);
  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({ message: 'Server error: ' + error.message });
  }
};

const getStores = async (req, res) => {
  try {
    const result = await query('SELECT * FROM stores');
    res.json(result.rows || []);
  } catch (error) {
    console.error('Get stores error:', error);
    res.status(500).json({ message: 'Server error: ' + error.message });
  }
};

const getStoreOwners = async (req, res) => {
  try {
    const result = await query('SELECT id, name, email FROM users WHERE role = ?', ['store_owner']);
    res.json(result.rows || []);
  } catch (error) {
    console.error('Get store owners error:', error);
    res.status(500).json({ message: 'Server error: ' + error.message });
  }
};

module.exports = { getDashboard, addUser, addStore, getUsers, getStores, getStoreOwners };