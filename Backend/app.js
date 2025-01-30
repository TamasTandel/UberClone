const mongoose = require('mongoose');
const dotenv = require("dotenv");
dotenv.config();  // Load environment variables from .env file

const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const connectToDb = require("./db/db");
const userRoutes = require("./routes/user.routes");
const captainRoutes = require("./routes/captian.routes");
const mapsRoutes = require('./routes/maps.routes');
const path = require("path");
const otpRoutes = require('./routes/otp.routes');
const User = require('./models/user.model'); // Import the User model

// Connect to the MongoDB database
connectToDb();

const app = express();

// Serve static files from the uploads directory
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.use(cors());

app.use(cors({
  origin: "http://localhost:5173", // Frontend URL
  methods: "GET,POST,PUT,DELETE",
  credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Log all incoming requests for debugging
app.use((req, res, next) => {
    console.log(`[${req.method}] ${req.url}`);
    next();
});

// Default route (optional)
app.get("/", (req, res) => {
    res.send("Hello, World!");
});

// API Routes
app.use('/api', otpRoutes);
app.use("/api/users", userRoutes);  // Use `/api/users` for user-related routes
app.use("/api/captains", captainRoutes);  // Use `/api/captains` for captain-related routes
app.use("/api/maps", mapsRoutes);  // Use `/api/maps` for maps-related routes (for storing locations)

// Error handling middleware
app.use((err, req, res, next) => {
    console.error("Error:", err.message);
    res.status(500).json({ error: "Internal Server Error" });
});

module.exports = app;
