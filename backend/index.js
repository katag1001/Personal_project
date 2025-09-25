const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();

// Import the route handlers for your application
const clothingRoutes = require('./routes/clothingRoutes');
const matchRoutes = require('./routes/matchRoutes');
const todayRoutes = require('./routes/todayRoutes');

const app = express();
const port = process.env.PORT || 4444;

// Middleware to enable CORS and parse request bodies
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

// Mount the router at /today


// Attach the API routes to specific endpoints
app.use('/api/clothing', clothingRoutes);
app.use('/api/match', matchRoutes); 
app.use('/api/today', todayRoutes);

// Start the server and listen for incoming requests
app.listen(port, () => {
  console.log(`🚀 Server is running on http://localhost:${port}`);
});
