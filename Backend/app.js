const mongoose = require('mongoose');
const dotenv = require("dotenv");
dotenv.config();

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
const User = require('./models/user.model'); 

connectToDb();

const app = express();

app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.use(cors({
  origin: "https://uber-clone-3.vercel.app",
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  credentials: true,
  allowedHeaders: 'Origin, X-Requested-With, Content-Type, Accept, Authorization'
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use((req, res, next) => {
    console.log(`[${req.method}] ${req.url}`);
    next();
});

app.get("/", (req, res) => {
    res.send("Hello, this app created by Tamas Tandel!");
});

app.use('/api', otpRoutes);
app.use("/api/users", userRoutes); 
app.use("/api/captains", captainRoutes); 
app.use("/api/maps", mapsRoutes); 

app.use((err, req, res, next) => {
    console.error("Error:", err.message);
    res.status(500).json({ error: "Internal Server Error" });
});

module.exports = app;
