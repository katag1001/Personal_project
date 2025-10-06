const mongoose = require('mongoose');

const outerSchema = new mongoose.Schema({
  name: { type: String, required: true},
  imageUrl: { type: String, default: "" },
  min_temp: { type: Number, required: true },
  max_temp: { type: Number, required: true },
  colors: { type: [String], required: true },
  styles: { type: [String], required: true },
  type: { type: String, default: "outer", enum: ["outer"], required: true },
  spring: { type: Boolean, required: true },
  summer: { type: Boolean, required: true },
  autumn: { type: Boolean, required: true },
  winter: { type: Boolean, required: true },
  username: { type: String, required: true, default: "guest" },
});

module.exports = mongoose.model('Outer', outerSchema);
