const express = require('express');
const router = express.Router();
const matchController = require('../controllers/matchController');

// Manual match creation (optional)
router.post('/', matchController.createMatch);

// Get all matches
router.get('/', matchController.getAllMatches);

// Get a specific match by ID
router.get('/:id', matchController.getMatchById);

// Update a match
router.put('/:id', matchController.updateMatch);

// Delete a match
router.delete('/:id', matchController.deleteMatch);

module.exports = router;