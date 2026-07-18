const express = require('express');
const { saveProfile, removeProfile } = require('../controllers/userController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/save-profile', protect, saveProfile);

// --- NEW ROUTE ---
router.post('/remove-profile', protect, removeProfile);

module.exports = router;