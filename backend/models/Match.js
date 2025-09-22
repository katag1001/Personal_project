const mongoose = require('mongoose');

const matchSchema = new mongoose.Schema({
  top: { type: String, default: null },
  bottom: { type: String, default: null },
  outer: { type: String, default: null },
  onepiece: { type: String, default: null },
  colors: [String],
  colorScore: Number,
  min_temp: Number,
  max_temp: Number,
  styles: [String],
  type: { type: String, default: 'match' },
  spring: Boolean,
  summer: Boolean,
  autumn: Boolean,
  winter: Boolean,
});

module.exports = mongoose.model('Match', matchSchema);
