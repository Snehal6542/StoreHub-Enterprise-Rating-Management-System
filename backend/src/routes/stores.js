const express = require('express');
const { getStores, submitRating, getStoreReviews } = require('../controllers/storeController');
const { auth } = require('../middleware/auth');

const router = express.Router();

router.get('/', auth, getStores);
router.get('/:storeId/reviews', auth, getStoreReviews);
router.post('/:storeId/rating', auth, submitRating);

module.exports = router;