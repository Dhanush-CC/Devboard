const express = require('express');
const { generateInsight } = require('../controllers/aiController');

const router = express.Router();

router.post('/insight', generateInsight);

module.exports = router;