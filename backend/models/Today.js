const mongoose = require('mongoose');

const todaySchema = new mongoose.Schema({
  _id: { type: mongoose.Schema.Types.ObjectId, required: true, auto: false }, // Keep original Match ID
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
  tags: { type: [String], required: false },
  rejected: { type: Boolean, required: true },
  lastWornDate: { type: Date, default: null },
  rank: { type: Number, default: null },
  userMade: { type: Boolean, required: true },
  username: { type: String, required: true, default: "guest" },
});

module.exports = mongoose.model('Today', todaySchema);
