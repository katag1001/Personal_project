const mongoose = require('mongoose');

const onePieceSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true},
  imageUrl: { type: String, default: "" },
  min_temp: { type: Number, required: true },
  max_temp: { type: Number, required: true },
  colors: { type: [String], required: true },
  styles: { type: [String], required: true },
  type: { type: String, default: "onepiece", enum: ["onepiece"], required: true },
  spring: { type: Boolean, required: true },
  summer: { type: Boolean, required: true },
  autumn: { type: Boolean, required: true },
  winter: { type: Boolean, required: true },
});

module.exports = mongoose.model('OnePiece', onePieceSchema);
