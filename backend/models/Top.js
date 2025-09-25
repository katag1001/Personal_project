const mongoose = require('mongoose');

const topSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true},
  imageUrl: { type: String, default: "" },
  min_temp: { type: Number, required: true },
  max_temp: { type: Number, required: true },
  colors: { type: [String], required: true },
  styles: { type: [String], required: true },
  type: { type: String, default: "top", enum: ["top"], required: true },
  spring: { type: Boolean, required: true },
  summer: { type: Boolean, required: true },
  autumn: { type: Boolean, required: true },
  winter: { type: Boolean, required: true },
});

module.exports = mongoose.model('Top', topSchema);
