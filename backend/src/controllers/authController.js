const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { validationResult } = require('express-validator');
const { query, queryOne, insert, update } = require('../config/database');

const register = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { name, email, password, address, role = 'normal' } = req.body;

  try {
    const existingUser = await queryOne('SELECT id FROM users WHERE email = ?', [email]);
    
    if (existingUser.data) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const result = await insert(
      'INSERT INTO users (name, email, password, address, role) VALUES (?, ?, ?, ?, ?)',
      [name, email, hashedPassword, address, role]
    );

    const newUser = await queryOne(
      'SELECT id, name, email, role FROM users WHERE id = ?',
      [result.data.id]
    );

    const token = jwt.sign(
      { id: newUser.data.id, role: newUser.data.role },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.status(201).json({
      token,
      user: newUser.data
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

const login = async (req, res) => {
  console.log('Login request body:', req.body);
  const { email, password } = req.body;

  if (!email || !password) {
    console.log('Missing email or password');
    return res.status(400).json({ message: 'Email and password are required' });
  }

  try {
    console.log('Querying user with email:', email);
    const user = await queryOne('SELECT * FROM users WHERE email = ?', [email]);
    console.log('User query result:', user);

    if (!user.data) {
      console.log('User not found');
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    console.log('Comparing passwords');
    const isMatch = await bcrypt.compare(password, user.data.password);
    console.log('Password match:', isMatch);
    
    if (!isMatch) {
      console.log('Password mismatch');
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { id: user.data.id, role: user.data.role },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    console.log('Login successful for user:', user.data.email);
    res.json({
      token,
      user: {
        id: user.data.id,
        name: user.data.name,
        email: user.data.email,
        role: user.data.role
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error: ' + error.message });
  }
};

const updatePassword = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { password } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);

  try {
    await update(
      'UPDATE users SET password = ? WHERE id = ?',
      [hashedPassword, req.user.id]
    );
    
    res.json({ message: 'Password updated successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { register, login, updatePassword };