const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI);
    console.log(`[QVSLV] MongoDB connecté : ${conn.connection.host}`);
  } catch (error) {
    console.error(`❌ Échec de connexion à MongoDB : ${error.message}`);
    // Ne pas crasher le process : le serveur HTTP reste actif, les routes renverront 503
    setTimeout(connectDB, 5000); // retry dans 5s
  }
};

module.exports = connectDB;
