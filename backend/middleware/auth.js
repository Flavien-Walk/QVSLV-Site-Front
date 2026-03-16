const jwt = require('jsonwebtoken');
const User = require('../models/User');

const protect = async (req, res, next) => {
  try {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Accès non autorisé. Token manquant.',
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);

    if (!user || !user.isActive) {
      return res.status(401).json({
        success: false,
        message: 'Utilisateur introuvable ou désactivé.',
      });
    }

    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: 'Token invalide ou expiré.',
    });
  }
};

const adminOnly = (req, res, next) => {
  if (req.user.accessLevel !== 'ADMIN') {
    return res.status(403).json({
      success: false,
      message: 'Accès réservé aux administrateurs.',
    });
  }
  next();
};

module.exports = { protect, adminOnly };
