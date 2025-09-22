const mongoose = require('mongoose');

const baseClothingSchema = new mongoose.Schema({
  name: String,
  imageUrl: String,
  min_temp: Number,
  max_temp: Number,
  colors: [String],
  styles: [String],
  type: String,
  spring: Boolean,
  summer: Boolean,
  autumn: Boolean,
  winter: Boolean,
});

module.exports = mongoose.model('Bottom', baseClothingSchema); 