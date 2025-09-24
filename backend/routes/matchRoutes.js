const express = require('express');
const router = express.Router();
const matchController = require('../controllers/matchController');

// Create one match
router.post('/match', matchController.createMatch);

// Create multiple matches in bulk
router.post('/bulk', matchController.createMatchesBulk);

// Get all matches
router.get('/', matchController.getAllMatches);

// Get a match by ID
router.get('/:id', matchController.getMatchById);

// Update a match by ID
router.put('/:id', matchController.updateMatch);

// Delete a match by ID
router.delete('/:id', matchController.deleteMatch);

module.exports = router;
