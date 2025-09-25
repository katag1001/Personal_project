const express = require('express');
const router = express.Router();
const todayController = require('../controllers/todayController');

router.post('/create', todayController.createToday);
router.get('/get', todayController.getToday);


module.exports = router;
