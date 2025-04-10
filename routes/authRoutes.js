const express = require('express');
const {
  welcome,
  register,
  login,
  profile,
  logout,
} = require('../controllers/authController');
const authenticate = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/', welcome);
router.post('/register', register);
router.post('/login', login);
router.get('/profile', authenticate, profile);
router.post('/logout', authenticate, logout);

module.exports = router;
