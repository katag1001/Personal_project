const Match = require('../models/Match');
const Today = require('../models/Today');

// Create today's outfits
exports.createToday = async (req, res) => {
  try {
    const { min_temp_today, max_temp_today, season_today } = req.body;

    if (
      typeof min_temp_today !== 'number' ||
      typeof max_temp_today !== 'number' ||
      !['spring', 'summer', 'autumn', 'winter'].includes(season_today)
    ) {
      return res.json({ message: 'Invalid input data.' });
    }

    const seasonFilter = {};
    seasonFilter[season_today] = true;

    const matches = await Match.find({
      min_temp: { $lte: min_temp_today },
      max_temp: { $gte: max_temp_today },
      ...seasonFilter,
    });

    if (matches.length === 0) {
      return res.json({ message: 'No matching outfits found for today.' });
    }

    const todayOutfits = matches.map((match) => {
      const matchObj = match.toObject();
      delete matchObj._id;
      return {
        ...matchObj,
        rank: null,
      };
    });

    await Today.deleteMany({});
    const inserted = await Today.insertMany(todayOutfits);

    res.json({
      message: `${inserted.length} outfits saved for today with no rank.`,
      data: inserted,
    });
  } catch (err) {
    console.error('Error in createToday:', err);
    res.json({ message: 'Internal server error.' });
  }
};

// Get today's outfits, sorted by rank
exports.getToday = async (req, res) => {
  try {
    const outfits = await Today.find().sort({ rank: 1 });

    if (outfits.length === 0) {
      return res.json({ message: 'No outfits found for today.' });
    }

    res.json(outfits);
  } catch (err) {
    console.error('Error in getToday:', err);
    res.json({ message: 'Internal server error.' });
  }
};
