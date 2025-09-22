const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();

const clothingRoutes = require('./routes/clothingRoutes');
const matchRoutes = require('./routes/matchRoutes');

const app = express();
const port = process.env.PORT || 4444;

app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

async function connectToDB() {
  try {
    await mongoose.connect(process.env.MONGO, {
      useUnifiedTopology: true,
      useNewUrlParser: true,
    });
    console.log("✅ Connected to MongoDB");
  } catch (err) {
    console.log("☢️ ERROR: Unable to connect to DB. Is MongoDB running?");
    console.error(err.message);
  }
}
connectToDB();

// Routes
app.use('/api/clothing', clothingRoutes);
app.use('/api/match', matchRoutes);

// Start server
app.listen(port, () => {
  console.log(`🚀 Server is running on http://localhost:${port}`);
});
