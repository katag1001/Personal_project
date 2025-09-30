const Match = require('../models/Match');

// Create one match item
exports.createMatch = async (req, res) => {
  try {
    const match = new Match(req.body);
    await match.save();
    res.json(match);
  } catch (error) {
    res.json({ error: error.message });
  }
};

// Create multiple match items (only used for automatic - no front end)
exports.createMatchesBulk = async (req, res) => {
  console.log("Received bulk matches:", req.body);
  try {
    const matches = await Match.insertMany(req.body);
    res.json(matches);
  } catch (error) {
    res.json({ error: error.message });
  }
};

// Get all matches
exports.getAllMatches = async (req, res) => {
  try {
    const matches = await Match.find();
    res.json(matches);
  } catch (error) {
    res.json({ error: error.message });
  }
};

// Get a match by ID
exports.getMatchById = async (req, res) => {
  try {
    const match = await Match.findById(req.params.id);
    res.json(match);
  } catch (error) {
    res.json({ error: error.message });
  }
};

// Update a match by ID
exports.updateMatch = async (req, res) => {
  try {
    const match = await Match.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(match);
  } catch (error) {
    res.json({ error: error.message });
  }
};

// Delete a match by ID
exports.deleteMatch = async (req, res) => {
  try {
    await Match.findByIdAndDelete(req.params.id);
    res.json({ message: 'Match deleted' });
  } catch (error) {
    res.json({ error: error.message });
  }
};
