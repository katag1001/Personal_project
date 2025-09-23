// ... (imports)
const Top = require('../models/Top');
const Bottom = require('../models/Bottom');
const Outer = require('../models/Outer');
const OnePiece = require('../models/OnePiece'); 
const Match = require('../models/Match');
const { matchPath } = require('../services/matchService');

// Helper function to get the correct model
const getModelByType = (type) => {
  switch (type.toLowerCase()) {
    case 'top':
      return Top;
    case 'bottom':
      return Bottom;
    case 'outerwear':
      return Outer;
    case 'onepiece':
      return OnePiece;
    default:
      return null;
  }
};

// Function to generate and save matches
async function generateMatchesForItem(itemDoc) {
  // Fetch all existing items from the database
  const [tops, bottoms, outer, onepieces] = await Promise.all([
    Top.find({}),
    Bottom.find({}),
    Outer.find({}),
    OnePiece.find({})
  ]);

  // Pass all item types to the matchPath service
  const matches = matchPath(itemDoc, tops, bottoms, outer, onepieces);

  // Save all generated matches to the database
  for (const match of matches) {
    await Match.findOneAndUpdate(
      {
        top: match.top,
        bottom: match.bottom,
        outer: match.outer,
        onepiece: match.onepiece,
      },
      match,
      { upsert: true, new: true }
    );
  }
}

// CREATE clothing item and generate matches
exports.createItem = async (req, res) => {
  try {
    const { type } = req.body;
    const Model = getModelByType(type);
    if (!Model) return res.status(400).json({ error: 'Invalid clothing type' });

    const newItem = await Model.create(req.body);
    // Call the function to generate and save matches for the new item
    await generateMatchesForItem(newItem.toObject());

    res.status(201).json(newItem);
  } catch (err) {
    console.error('Create Item Error:', err);
    res.status(500).json({ error: 'Failed to create clothing item' });
  }
};

// ... (other controller functions)
exports.deleteItemById = async (req, res) => {
  try {
    const { type, id } = req.params;
    const Model = getModelByType(type);
    if (!Model) return res.status(400).json({ error: 'Invalid clothing type' });

    const deletedItem = await Model.findByIdAndDelete(id);
    if (!deletedItem) return res.status(404).json({ error: 'Item not found' });

    const itemName = deletedItem.name;

    // Delete all matches that included the deleted item
    await Match.deleteMany({
      $or: [
        { top: itemName },
        { bottom: itemName },
        { outer: itemName },
        { onepiece: itemName },
      ]
    });

    res.status(200).json({ message: 'Item deleted successfully' });
  } catch (err) {
    console.error('Delete Item Error:', err);
    res.status(500).json({ error: 'Failed to delete item' });
  }
};

// GET all items by type
exports.getAllItems = async (req, res) => {
  try {
    const { type } = req.params;
    const Model = getModelByType(type);
    if (!Model) return res.status(400).json({ error: 'Invalid clothing type' });

    const items = await Model.find();
    res.status(200).json(items);
  } catch (err) {
    console.error('Get All Items Error:', err);
    res.status(500).json({ error: 'Failed to retrieve items' });
  }
};

// GET one item by ID
exports.getItemById = async (req, res) => {
  try {
    const { type, id } = req.params;
    const Model = getModelByType(type);
    if (!Model) return res.status(400).json({ error: 'Invalid clothing type' });

    const item = await Model.findById(id);
    if (!item) return res.status(404).json({ error: 'Item not found' });

    res.status(200).json(item);
  } catch (err) {
    console.error('Get Item By ID Error:', err);
    res.status(500).json({ error: 'Failed to retrieve item' });
  }
};

// UPDATE item by type and ID
exports.updateItemById = async (req, res) => {
  try {
    const { type, id } = req.params;
    const Model = getModelByType(type);
    if (!Model) return res.status(400).json({ error: 'Invalid clothing type' });

    const updatedItem = await Model.findByIdAndUpdate(id, req.body, { new: true });
    if (!updatedItem) return res.status(404).json({ error: 'Item not found' });

    // Re-generate matches for the updated item
    await Match.deleteMany({
      $or: [
        { top: updatedItem.name },
        { bottom: updatedItem.name },
        { outer: updatedItem.name },
        { onepiece: updatedItem.name },
      ]
    });
    await generateMatchesForItem(updatedItem.toObject());

    res.status(200).json(updatedItem);
  } catch (err) {
    console.error('Update Item Error:', err);
    res.status(500).json({ error: 'Failed to update item' });
  }
};