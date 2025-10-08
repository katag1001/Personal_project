const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();

// Import the route handlers for your application
const allRoutes = require('./routes/allRoutes');

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

const cloudinary = require("cloudinary");
cloudinary.config({
	cloud_name: process.env.CLOUD_NAME || "default_value",
	api_key: process.env.API_KEY || "default_value",
	api_secret: process.env.API_SECRET || "default_value",
  });
  (async () => {
	try {
	  const response = await cloudinary.api.ping();
	  console.log("Cloudinary connection test:", response);
	} catch (error) {
	  console.error("Cloudinary connection failed:", error);
	}
  })();


// Attach the API routes to specific endpoints
app.use('/api', allRoutes);

module.exports = app;

// And for development only start the server if we're not in a serverless environment
// This will only happen locally in development mode
if (process.env.NODE_ENV !== 'production') {

  // Serve static files from the dist directory
  app.use(express.static("dist"));
  // Serve index.html for all other requests
  app.get("/{*splat}", (req, res) => {
    res.sendFile(__dirname + "/dist/index.html");
  });
  // Start the server
  const port = process.env.PORT || 4444;
  app.listen(port, () => console.log("🚀 Listening on port: " + port + " 🚀"));
}

