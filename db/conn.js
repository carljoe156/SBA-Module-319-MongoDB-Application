// This is our connection to mongodb/mongoose
const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config();

// This is our Global Configuration
const mongoURI = process.env.MONGO_URI;
const db = mongoose.connection;

// connected to mongodb
mongoose.connect(mongoURI);
mongoose.connection.once("open", () => {
  console.log("connected to mongodb");
});

module.exports = db;
