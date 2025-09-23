
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
  const [tops, bottoms, outer, onepieces] = await Promise.all([
    Top.find({}),
    Bottom.find({}),
    Outer.find({}),
    OnePiece.find({})
  ]);

  // Capture the returned array from matchPath
  const matches = matchPath(itemDoc, tops, bottoms, outer);

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
    if (!Model) return res.json({ error: 'Invalid clothing type' });

    const newItem = await Model.create(req.body);
    await generateMatchesForItem(newItem.toObject());

    res.json(newItem);
  } catch (err) {
    console.error('Create Item Error:', err);
    res.json({ error: 'Failed to create clothing item' });
  }
};

// UPDATE clothing item and regenerate matches
exports.updateItemById = async (req, res) => {
  try {
    const { type, id } = req.params;
    const Model = getModelByType(type);
    if (!Model) return res.json({ error: 'Invalid clothing type' });

    const updatedItem = await Model.findByIdAndUpdate(id, req.body, { new: true });
    if (!updatedItem) return res.json({ error: 'Item not found' });

    const itemName = updatedItem.name;

    await Match.deleteMany({
      $or: [
        { top: itemName },
        { bottom: itemName },
        { outer: itemName },
        { onepiece: itemName },
      ]
    });

    await generateMatchesForItem(updatedItem.toObject());

    res.json(updatedItem);
  } catch (err) {
    console.error('Update Item Error:', err);
    res.json({ error: 'Failed to update item' });
  }
};

// DELETE clothing item and associated matches
exports.deleteItemById = async (req, res) => {
  try {
    const { type, id } = req.params;
    const Model = getModelByType(type);
    if (!Model) return res.json({ error: 'Invalid clothing type' });

    const deletedItem = await Model.findByIdAndDelete(id);
    if (!deletedItem) return res.json({ error: 'Item not found' });

    const itemName = deletedItem.name;

    await Match.deleteMany({
      $or: [
        { top: itemName },
        { bottom: itemName },
        { outer: itemName },
        { onepiece: itemName },
      ]
    });

    res.json({ message: 'Item deleted successfully' });
  } catch (err) {
    console.error('Delete Item Error:', err);
    res.json({ error: 'Failed to delete item' });
  }
};

// GET all items by type
exports.getAllItems = async (req, res) => {
  try {
    const { type } = req.params;
    const Model = getModelByType(type);
    if (!Model) return res.json({ error: 'Invalid clothing type' });

    const items = await Model.find();
    res.json(items);
  } catch (err) {
    console.error('Get All Items Error:', err);
    res.json({ error: 'Failed to retrieve items' });
  }
};

// GET one item by ID
exports.getItemById = async (req, res) => {
  try {
    const { type, id } = req.params;
    const Model = getModelByType(type);
    if (!Model) return res.json({ error: 'Invalid clothing type' });

    const item = await Model.findById(id);
    if (!item) return res.json({ error: 'Item not found' });

    res.json(item);
  } catch (err) {
    console.error('Get Item By ID Error:', err);
    res.json({ error: 'Failed to retrieve item' });
  }
};
