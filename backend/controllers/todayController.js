const Match = require('../models/Match');
const Today = require('../models/Today');

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

    const timeLabel = `[createToday] ${Date.now()}`;
    console.log(`[createToday] Received input: min=${min_temp_today}, max=${max_temp_today}, season=${season_today}`);
    console.time(timeLabel);

    const matches = await Match.find({
      min_temp: { $lte: min_temp_today },
      max_temp: { $gte: max_temp_today },
      ...seasonFilter,
    });

    if (matches.length === 0) {
      console.timeEnd(timeLabel);
      return res.json({ message: 'No matching outfits found for today.' });
    }

    const todayOutfits = matches.map((match) => {
      const matchObj = match.toObject();
      delete matchObj._id;
      return {
        ...matchObj,
        rank: 1,
      };
    });

    await Today.deleteMany({});
    const inserted = await Today.insertMany(todayOutfits);

    console.timeEnd(timeLabel);

    res.json({
      message: `${inserted.length} outfits saved for today with rank 1.`,
      data: inserted,
    });
  } catch (err) {
    console.error('Error in createToday:', err);
    res.status(500).json({ message: 'Internal server error.' });
  }
};


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

