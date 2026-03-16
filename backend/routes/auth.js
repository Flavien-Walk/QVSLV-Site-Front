const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { protect } = require('../middleware/auth');

const router = express.Router();

// Génère un JWT
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  });
};

// POST /api/auth/register
router.post('/register', async (req, res) => {
  try {
    const { firstName, lastName, username, email, password, specialization, motivation } = req.body;

    // Vérification champs obligatoires
    if (!firstName || !lastName || !username || !email || !password || !specialization) {
      return res.status(400).json({
        success: false,
        message: 'Tous les champs obligatoires doivent être remplis.',
      });
    }

    // Vérif unicité username
    const existingUsername = await User.findOne({ username });
    if (existingUsername) {
      return res.status(409).json({
        success: false,
        message: "Ce nom d'utilisateur est déjà pris.",
      });
    }

    // Vérif unicité email
    const existingEmail = await User.findOne({ email: email.toLowerCase() });
    if (existingEmail) {
      return res.status(409).json({
        success: false,
        message: 'Cet email est déjà utilisé.',
      });
    }

    const user = await User.create({
      firstName,
      lastName,
      username,
      email,
      password,
      specialization,
      motivation: motivation || '',
    });

    const token = generateToken(user._id);

    res.status(201).json({
      success: true,
      message: 'Compte créé avec succès.',
      token,
      user: user.toPublic(),
    });
  } catch (error) {
    // Erreurs de validation Mongoose
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map((e) => e.message);
      return res.status(400).json({
        success: false,
        message: messages[0],
      });
    }

    console.error('[REGISTER ERROR]', error);
    res.status(500).json({
      success: false,
      message: 'Erreur serveur. Veuillez réessayer.',
    });
  }
});

// POST /api/auth/login
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({
        success: false,
        message: "Nom d'utilisateur et mot de passe requis.",
      });
    }

    // Chercher par username OU email
    const user = await User.findOne({
      $or: [{ username }, { email: username.toLowerCase() }],
    }).select('+password');

    if (!user || !user.isActive) {
      return res.status(401).json({
        success: false,
        message: 'Identifiants incorrects.',
      });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Identifiants incorrects.',
      });
    }

    // Mise à jour lastLogin
    user.lastLogin = new Date();
    await user.save({ validateBeforeSave: false });

    const token = generateToken(user._id);

    res.status(200).json({
      success: true,
      message: 'Connexion réussie.',
      token,
      user: user.toPublic(),
    });
  } catch (error) {
    console.error('[LOGIN ERROR]', error);
    res.status(500).json({
      success: false,
      message: 'Erreur serveur. Veuillez réessayer.',
    });
  }
});

// GET /api/auth/me — Profil de l'utilisateur connecté
router.get('/me', protect, async (req, res) => {
  res.status(200).json({
    success: true,
    user: req.user.toPublic(),
  });
});

module.exports = router;
