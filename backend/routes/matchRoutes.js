const express = require('express');
const router = express.Router();
const matchController = require('../controllers/matchController');

router.post('/generate-match', matchController.generateMatches);

module.exports = router;
