const mongoose = require('mongoose');

const todaySchema = new mongoose.Schema({
  top: { type: String, default: null },
  bottom: { type: String, default: null },
  outer: { type: String, default: null },
  onepiece: { type: String, default: null },
  colors: { type: [String], required: true },
  min_temp: { type: Number, required: true },
  max_temp: { type: Number, required: true },
  type: { type: String, required: true },
  spring: { type: Boolean, required: true },
  summer: { type: Boolean, required: true },
  autumn: { type: Boolean, required: true },
  winter: { type: Boolean, required: true },
  styles: { type: [String], required: true },
  lastWornDate: { type: Date, default: null },
  rank: { type: Number, default: null }, // Set to null by default
});

module.exports = mongoose.model('Today', todaySchema);
