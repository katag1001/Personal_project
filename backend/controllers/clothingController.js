const Top = require('../models/Top');
const Bottom = require('../models/Bottom');
const Outerwear = require('../models/Outer');
const OnePiece = require('../models/OnePiece');
const Match = require('../models/Match');
const { processMatches } = require('../services/matchService');


function getModel(type) {
  if (type === 'top') return Top;
  if (type === 'bottom') return Bottom;
  if (type === 'outerwear') return Outerwear;
  if (type === 'onepiece') return OnePiece;
  return null;
}

exports.createItem = async (req, res) => {
  const { type } = req.body;
  const username = req.body.username;
  const Model = getModel(type);
  if (!Model) return res.json({ error: 'Invalid type' });

  try {
    const duplicateCriteria = {
      name: req.body.name
    };

    const existingItem = await Model.findOne(duplicateCriteria);

    if (existingItem) {
      return res.json({ error: 'Duplicate item already exists', item: existingItem });
    }

    const item = new Model(req.body);
    await item.save();

    const [tops, bottoms, outerwear, onepieces] = await Promise.all([
      Top.find({'username':username}),
      Bottom.find({'username':username}),
      Outerwear.find({'username':username}),
      OnePiece.find({'username':username})
    ]);

    processMatches(item, tops, bottoms, outerwear, onepieces);
    console.log("Match processing completed.");
    res.json(item);

  } catch (error) {
    res.json({ error: error.message });
  }
};

exports.getAllItems = async (req, res) => {
  const { type } = req.params;
  const username = req.body.username;
  const Model = getModel(type);
  if (!Model) return res.json({ error: 'Invalid type' });

  try {
    const items = await Model.find({'username':username});
    res.json(items);
  } catch (error) {
    res.json({ error: error.message });
  }
};

exports.getItemById = async (req, res) => {
  const { type, id } = req.params;
  const Model = getModel(type);
  if (!Model) return res.json({ error: 'Invalid type' });

  try {
    const item = await Model.findById(id);
    if (!item) return res.json({ message: `${type} not found` });
    res.json(item);
  } catch (error) {
    res.json({ error: error.message });
  }
};

exports.getItemByName = async (req, res) => {
  const { type, name } = req.params;
  const username = req.body.username;
  console.log(`Fetching ${type} with name "${name}" for user "${username}"`);

  const Model = getModel(type);
  if (!Model) return res.json({ error: 'Invalid type' });

  try {
    // Add username to the filter along with name
    const item = await Model.findOne({ 'name': name, 'username': username });
    if (!item) {
      return res.json({ message: `${type} with name "${name}" for user "${username}" not found` });
    }
    res.json(item);
  } catch (error) {
    res.json({ error: error.message });
  }
};


exports.updateItem = async (req, res) => {
  const { type, id } = req.params;
  const Model = getModel(type);
  if (!Model) return res.json({ error: 'Invalid type' });

  try {
    // Step 1: Find the existing item to get its current name
    const existingItem = await Model.findById(id);
    if (!existingItem) return res.json({ message: `${type} not found` });

    const oldName = existingItem.name;

    // Step 2: Update the item
    const updatedItem = await Model.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    });

    // Step 3: If type is relevant, delete related matches that used the old name
    const allowedFields = ['top', 'bottom', 'outer', 'onepiece'];
    if (allowedFields.includes(type)) {
      const filter = {};
      filter[type] = oldName;

      const matchDeleteResult = await Match.deleteMany(filter);
      console.log(`Deleted ${matchDeleteResult.deletedCount} matches using this ${type}`);

      // Step 4: Process new matches using the updated item
      const [tops, bottoms, outerwear, onepieces] = await Promise.all([
        Top.find(),
        Bottom.find(),
        Outerwear.find(),
        OnePiece.find()
      ]);

      processMatches(updatedItem, tops, bottoms, outerwear, onepieces);
      console.log("Match processing completed after update.");
    }

    res.json(updatedItem);
  } catch (error) {
    res.json({ error: error.message });
  }
};

exports.deleteItem = async (req, res) => {
  const { type, id } = req.params;
  const Model = getModel(type);
  if (!Model) return res.json({ error: 'Invalid type' });

  try {
    // Step 1: Find the item first
    const item = await Model.findById(id);
    if (!item) return res.json({ message: `${type} not found` });

    const pieceValue = item.name

    // Step 2: Delete all matches that use this item
    const allowedFields = ['top', 'bottom', 'outer', 'onepiece'];
    if (allowedFields.includes(type)) {
      const filter = {};
      filter[type] = pieceValue;

      const matchDeleteResult = await Match.deleteMany(filter);
      console.log(`Deleted ${matchDeleteResult.deletedCount} matches using this ${type}`);
    }

    // Step 3: Delete the item itself
    await Model.findByIdAndDelete(id);

    res.json({ message: `${type} and related matches deleted successfully` });
  } catch (error) {
    res.json({ error: error.message });
  }
};

