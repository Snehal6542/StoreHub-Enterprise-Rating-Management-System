const express = require('express');
const { getDashboard, addUser, addStore, getUsers, getStores, getStoreOwners } = require('../controllers/adminController');
const { userValidation, storeValidation, handleValidationErrors } = require('../utils/validators');
const { auth, adminAuth } = require('../middleware/auth');

const router = express.Router();

router.get('/dashboard', auth, adminAuth, getDashboard);
router.post('/users', auth, adminAuth, userValidation, handleValidationErrors, addUser);
router.post('/stores', auth, adminAuth, storeValidation, handleValidationErrors, addStore);
router.get('/users', auth, adminAuth, getUsers);
router.get('/stores', auth, adminAuth, getStores);
router.get('/store-owners', auth, adminAuth, getStoreOwners);

module.exports = router;