const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI);
    console.log(`[QVSLV] MongoDB connecté : ${conn.connection.host}`);
  } catch (error) {
    console.error(`[QVSLV] Erreur MongoDB : ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;
