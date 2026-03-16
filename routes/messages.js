const express = require('express');
const Message = require('../models/Message');
const { protect } = require('../middleware/auth');

const router = express.Router();

// GET /api/messages — 50 derniers messages
router.get('/', async (req, res) => {
  try {
    const messages = await Message.find()
      .populate('user', 'username accessLevel')
      .sort({ createdAt: 1 })
      .limit(50);
    res.json({ success: true, messages });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Erreur serveur.' });
  }
});

// POST /api/messages — envoyer un message (authentifié)
router.post('/', protect, async (req, res) => {
  try {
    const { text } = req.body;
    if (!text?.trim()) return res.status(400).json({ success: false, message: 'Message vide.' });

    const message = await Message.create({ user: req.user._id, text: text.trim() });
    await message.populate('user', 'username accessLevel');

    res.status(201).json({ success: true, message });
  } catch (error) {
    if (error.name === 'ValidationError') {
      return res.status(400).json({ success: false, message: Object.values(error.errors)[0].message });
    }
    res.status(500).json({ success: false, message: 'Erreur serveur.' });
  }
});

module.exports = router;
