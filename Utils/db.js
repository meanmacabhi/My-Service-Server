const mongoose = require("mongoose");

const URI = process.env.MONGO_URI;

const connectDb = async () => {
  try {
    await mongoose.connect(URI);
    console.log("DATABASE CONNECTED");
  } catch (error) {
    console.error("Database connection failed:", error.message);
    throw error; // 🔁 Let server.js handle the failure
  }
};

module.exports = connectDb;
