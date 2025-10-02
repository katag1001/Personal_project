const express = require('express');
const router = express.Router();
const matchController = require('../controllers/matchController');

router.post('/matches', matchController.createMatch);
router.post('/bulk', matchController.createMatchesBulk);
router.post('/', matchController.getAllMatches);
router.get('/:id', matchController.getMatchById);
router.put('/:id', matchController.updateMatch);
router.delete('/:id', matchController.deleteMatch);

module.exports = router;
