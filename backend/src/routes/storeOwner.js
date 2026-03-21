const express = require('express');
const { getDashboard, createStore } = require('../controllers/storeOwnerController');
const { storeOwnerStoreValidation, handleValidationErrors } = require('../utils/validators');
const { auth, storeOwnerAuth } = require('../middleware/auth');

const router = express.Router();

router.get('/dashboard', auth, storeOwnerAuth, getDashboard);
router.post('/store', auth, storeOwnerAuth, storeOwnerStoreValidation, handleValidationErrors, createStore);

module.exports = router;