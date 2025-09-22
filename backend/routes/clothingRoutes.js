const express = require('express');
const router = express.Router();
const clothingController = require('../controllers/clothingController');

// Create item (POST body must include `type`)
router.post('/', clothingController.createItem);

// Get all items by type
router.get('/:type', clothingController.getAllItems);

// Get single item by type and ID
router.get('/:type/:id', clothingController.getItemById);

// Update item by type and ID
router.put('/:type/:id', clothingController.updateItemById);

// Delete item by type and ID
router.delete('/:type/:id', clothingController.deleteItemById);

module.exports = router;
