const express = require('express');
const { getGitHubProfile } = require('../controllers/githubController');

const router = express.Router();

router.get('/:username', getGitHubProfile);

module.exports = router;