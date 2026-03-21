const { query, queryOne, insert, update } = require('../config/database');

const getStores = async (req, res) => {
  try {
    console.log('Getting stores for user:', req.user.id);
    
    // Simple query to get all stores first
    const storesResult = await query('SELECT * FROM stores');
    console.log('Raw stores result:', storesResult);
    
    if (!storesResult.rows || storesResult.rows.length === 0) {
      console.log('No stores found in database');
      return res.json([]);
    }
    
    const stores = [];
    
    for (const store of storesResult.rows) {
      // Get average rating and count
      const avgResult = await queryOne(
        'SELECT COALESCE(AVG(rating), 0) as avg_rating, COUNT(*) as total_ratings FROM ratings WHERE store_id = ?',
        [store.id]
      );
      
      // Get user's rating and review
      const userRatingResult = await queryOne(
        'SELECT rating, review FROM ratings WHERE store_id = ? AND user_id = ?',
        [store.id, req.user.id]
      );
      
      stores.push({
        ...store,
        overall_rating: avgResult.data?.avg_rating || 0,
        total_ratings: avgResult.data?.total_ratings || 0,
        user_rating: userRatingResult.data?.rating || null,
        user_review: userRatingResult.data?.review || null
      });
    }
    
    console.log('Returning stores:', stores.length);
    res.json(stores);
  } catch (error) {
    console.error('Error fetching stores:', error);
    res.status(500).json({ message: 'Server error: ' + error.message });
  }
};

const submitRating = async (req, res) => {
  const { storeId } = req.params;
  const { rating, review } = req.body;

  if (rating < 1 || rating > 5) {
    return res.status(400).json({ message: 'Rating must be between 1 and 5' });
  }

  try {
    console.log('Submitting rating:', { storeId, rating, review, userId: req.user.id });
    
    // Check if rating exists first
    const existingRating = await queryOne(
      'SELECT id FROM ratings WHERE user_id = ? AND store_id = ?',
      [req.user.id, storeId]
    );
    
    if (existingRating.data) {
      // Update existing rating
      await update(
        'UPDATE ratings SET rating = ?, review = ?, updated_at = CURRENT_TIMESTAMP WHERE user_id = ? AND store_id = ?',
        [rating, review || '', req.user.id, storeId]
      );
    } else {
      // Insert new rating
      await insert(
        'INSERT INTO ratings (user_id, store_id, rating, review) VALUES (?, ?, ?, ?)',
        [req.user.id, storeId, rating, review || '']
      );
    }

    res.json({ message: 'Rating submitted successfully' });
  } catch (error) {
    console.error('Error submitting rating:', error);
    res.status(500).json({ message: 'Server error: ' + error.message });
  }
};

const getStoreReviews = async (req, res) => {
  const { storeId } = req.params;
  
  try {
    const reviews = await query(`
      SELECT r.rating, r.review, r.created_at, u.name, u.email
      FROM ratings r
      JOIN users u ON r.user_id = u.id
      WHERE r.store_id = ? AND r.review IS NOT NULL AND r.review != ''
      ORDER BY r.created_at DESC
    `, [storeId]);
    
    res.json(reviews.rows || []);
  } catch (error) {
    console.error('Error fetching reviews:', error);
    res.status(500).json({ message: 'Server error: ' + error.message });
  }
};

module.exports = { getStores, submitRating, getStoreReviews };