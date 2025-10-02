const Match = require('../models/Match');
const Today = require('../models/Today');

exports.createToday = async (req, res) => {
  try {
    const { min_temp_today, max_temp_today, season_today, username } = req.body;

    console.log(`[createToday] Incoming request at ${new Date().toISOString()}`);
    console.log(`[createToday] Payload received:`, { min_temp_today, max_temp_today, season_today });

    // ✅ Input validation
    if (
      typeof min_temp_today !== 'number' ||
      typeof max_temp_today !== 'number' ||
      !['spring', 'summer', 'autumn', 'winter'].includes(season_today)
    ) {
      console.warn('[createToday] Invalid input data.');
      return res.json({ message: 'Invalid input data.', success: false });
    }

    // ✅ Build dynamic season filter
    const seasonFilter = {};
    seasonFilter[season_today] = true;

    const timeLabel = `[createToday] Query time`;
    console.time(timeLabel);

    // ✅ Find matching outfits
    const matches = await Match.find({
      min_temp: { $gte: min_temp_today },
      max_temp: { $lte: max_temp_today },
      rejected: false, 
      ...seasonFilter,
      username: username
    });

    console.timeEnd(timeLabel);
    console.log(`[createToday] Found ${matches.length} match(es).`);

    // ✅ Clear previous outfits regardless of matches found
    await Today.deleteMany({});

    if (matches.length === 0) {
      console.log('[createToday] No matches found for today.');
      return res.json({
        message: 'No matching outfits found for today. Cleared old outfits.',
        matchesFound: false,
        success: true,
      });
    }

    // ✅ Prepare matches to insert (KEEP original _id)
    const todayOutfits = matches.map((match) => {
      const matchObj = match.toObject();
      // KEEP matchObj._id here - do NOT delete it
      return {
        ...matchObj,
        rank: 1,
      };
    });

    // ✅ Insert new outfits
    const inserted = await Today.insertMany(todayOutfits);

    console.log(`[createToday] Inserted ${inserted.length} outfit(s) for today.`);

    return res.json({
      message: `${inserted.length} outfits saved for today with rank 1.`,
      data: inserted,
      matchesFound: true,
      success: true,
    });
  } catch (err) {
    console.error('[createToday] ❌ Error:', err);
    return res.status(500).json({ message: 'Internal server error.', success: false });
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

