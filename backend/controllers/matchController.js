const Match = require('../models/Match');
const Top = require('../models/Top');
const Bottom = require('../models/Bottom');
const Outer = require('../models/Outer');
const { matchPath } = require('../services/matchService');

// CREATE manual match
exports.createMatch = async (req, res) => {
  try {
    const match = new Match(req.body);
    await match.save();
    res.json(match);
  } catch (error) {
    console.error('Create Match Error:', error);
    res.json({ error: error.message });
  }
};

// New function to generate and save matches
exports.generateAndSaveMatches = async (req, res) => {
  try {
    const { newItem } = req.body;
    
    // Fetch all existing items from the database
    const [tops, bottoms, outer] = await Promise.all([
      Top.find({}),
      Bottom.find({}),
      Outer.find({}),
    ]);
    
    // Use the matchPath service to generate potential matches
    const newMatches = matchPath(newItem, tops, bottoms, outer);

    // Save all generated matches to the database
    for (const match of newMatches) {
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

    res.json({ message: "Matches generated and saved successfully", newMatches });
    
  } catch (error) {
    console.error('Generate and Save Matches Error:', error);
    res.json({ error: error.message });
  }
};

// GET all matches
exports.getAllMatches = async (req, res) => {
  try {
    const matches = await Match.find({});
    res.json(matches);
  } catch (error) {
    console.error('Get All Matches Error:', error);
    res.json({ error: error.message });
  }
};

// GET match by ID
exports.getMatchById = async (req, res) => {
  try {
    const match = await Match.findById(req.params.id);
    if (!match) return res.json({ error: "Match not found" });
    res.json(match);
  } catch (error) {
    console.error('Get Match By ID Error:', error);
    res.json({ error: error.message });
  }
};

// UPDATE match by ID
exports.updateMatch = async (req, res) => {
  try {
    const updated = await Match.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!updated) return res.json({ error: "Match not found" });
    res.json(updated);
  } catch (error) {
    console.error('Update Match Error:', error);
    res.json({ error: error.message });
  }
};

// DELETE match by ID
exports.deleteMatch = async (req, res) => {
  try {
    const deleted = await Match.findByIdAndDelete(req.params.id);
    if (!deleted) return res.json({ error: "Match not found" });
    res.json({ message: "Match deleted" });
  } catch (error) {
    console.error('Delete Match Error:', error);
    res.json({ error: error.message });
  }
};