const express = require('express');
const { saveProfile } = require('../controllers/userController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

// The "protect" middleware runs first to verify the JWT
router.post('/save-profile', protect, saveProfile);

module.exports = router;