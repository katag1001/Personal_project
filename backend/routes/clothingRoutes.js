const express = require('express');
const router = express.Router();
const clothingController = require('../controllers/clothingController');

// Create item (POST body must include `type`)
router.post('/', clothingController.createItem);
router.post('/:type', clothingController.getAllItems);
router.get('/:type/:id', clothingController.getItemById);
router.put('/:type/:id', clothingController.updateItem);
router.delete('/:type/:id', clothingController.deleteItem);
router.post('/:type/:name', clothingController.getItemByName);



module.exports = router;
