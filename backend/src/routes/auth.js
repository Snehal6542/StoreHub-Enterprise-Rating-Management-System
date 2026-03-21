const express = require('express');
const { register, login, updatePassword } = require('../controllers/authController');
const { userValidation, passwordValidation, handleValidationErrors } = require('../utils/validators');
const { auth } = require('../middleware/auth');

const router = express.Router();

router.post('/register', userValidation, handleValidationErrors, register);
router.post('/login', login);
router.put('/password', auth, passwordValidation, handleValidationErrors, updatePassword);

module.exports = router;