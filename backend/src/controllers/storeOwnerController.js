const { queryOne, insert } = require('../config/database');

const getDashboard = async (req, res) => {
  try {
    const storeResult = await queryOne('SELECT * FROM stores WHERE owner_id = ?', [req.user.id]);
    
    if (!storeResult.data) {
      return res.json({ hasStore: false });
    }

    const storeId = storeResult.data.id;
    const avgRatingResult = await queryOne(
      'SELECT COALESCE(AVG(rating), 0) as average_rating FROM ratings WHERE store_id = ?',
      [storeId]
    );

    const ratingsResult = await queryOne(`
      SELECT u.name, u.email, r.rating, r.created_at
      FROM ratings r
      JOIN users u ON r.user_id = u.id
      WHERE r.store_id = ?
      ORDER BY r.created_at DESC
    `, [storeId]);

    res.json({
      hasStore: true,
      store: storeResult.data,
      averageRating: parseFloat(avgRatingResult.data?.average_rating || 0).toFixed(2),
      ratings: ratingsResult.data ? [ratingsResult.data] : []
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

const createStore = async (req, res) => {
  const { name, email, address } = req.body;
  
  try {
    const existingStore = await queryOne('SELECT id FROM stores WHERE owner_id = ?', [req.user.id]);
    if (existingStore.data) {
      return res.status(400).json({ message: 'You already have a store registered' });
    }

    await insert(
      'INSERT INTO stores (name, email, address, owner_id) VALUES (?, ?, ?, ?)',
      [name, email, address, req.user.id]
    );

    res.status(201).json({ message: 'Store created successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { getDashboard, createStore };