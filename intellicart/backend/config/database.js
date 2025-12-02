const mongoose = require('mongoose');
const MONGO_URI = process.env.MONGO_URI;

const connectDatabase = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("MongoDB Connected Successfully");
  } catch (err) {
    console.log("MongoDB Connection Error:", err);
    process.exit(1);
  }
}

module.exports = connectDatabase;
