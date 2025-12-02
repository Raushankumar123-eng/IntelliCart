const mongoose = require('mongoose');
const MONGO_URI = process.env.MONGO_URI;

const connectDatabase = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("MongoDB Connected Successfully");
  } catch (error) {
    console.log("MongoDB Error:", error);
    process.exit(1);
  }
};

module.exports = connectDatabase;
