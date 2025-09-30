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
      Top.find(),
      Bottom.find(),
      Outerwear.find(),
      OnePiece.find()
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
  const Model = getModel(type);
  if (!Model) return res.json({ error: 'Invalid type' });

  try {
    const items = await Model.find();
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
  const Model = getModel(type);
  if (!Model) return res.json({ error: 'Invalid type' });

  try {
    const item = await Model.findOne({ name: name });
    if (!item) return res.json({ message: `${type} with name "${name}" not found` });
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
    const item = await Model.findByIdAndUpdate(id, req.body, { new: true, runValidators: true });
    if (!item) return res.json({ message: `${type} not found` });
    res.json(item);
  } catch (error) {
    res.json({ error: error.message });
  }
};

exports.deleteItem = async (req, res) => {
  const { type, id } = req.params;
  const Model = getModel(type);
  if (!Model) return res.json({ error: 'Invalid type' });

  try {
    const item = await Model.findByIdAndDelete(id);
    if (!item) return res.json({ message: `${type} not found` });
    res.json({ message: `${type} deleted successfully` });
  } catch (error) {
    res.json({ error: error.message });
  }
};
