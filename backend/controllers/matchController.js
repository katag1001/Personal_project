const Match = require('../models/Match');

// Create one match item
exports.createMatch = async (req, res) => {
   console.log('Received body:', req.body);
  try {
    const match = new Match(req.body);
    await match.save();
    console.log('Match saved to DB:', match); 
    res.json(match);
  } catch (error) {
    res.json({ error: error.message });
  }
};

// Create multiple match items (only used for automatic from the match algorithm - no front end)
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
  const username = req.body.username;
  try {
    const matches = await Match.find({'username':username});
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

// For when the piece is deleted - delete all matches containing that piece
exports.deleteMatchesByPiece = async (req, res) => {
  try {
    const { pieceType, pieceValue } = req.body;

    const allowedFields = ['top', 'bottom', 'outer', 'onepiece'];
    if (!allowedFields.includes(pieceType)) {
      return res.json({ error: 'Invalid piece type' });
    }

    const filter = {};
    filter[pieceType] = pieceValue;

    const result = await Match.deleteMany(filter);

    res.json({ message: `Deleted ${result.deletedCount} matches` });
  } catch (error) {
    res.json({ error: error.message });
  }
};



