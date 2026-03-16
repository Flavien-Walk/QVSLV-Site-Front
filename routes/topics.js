const express = require('express');
const Topic = require('../models/Topic');
const { protect } = require('../middleware/auth');

const router = express.Router();

// Middleware optionnel — attache req.user si token présent, ne bloque pas si absent
const optionalAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const jwt = require('jsonwebtoken');
      const User = require('../models/User');
      const token = authHeader.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findById(decoded.id);
      if (user && user.isActive) req.user = user;
    }
  } catch {
    // Token invalide ignoré — visiteur anonyme
  }
  next();
};

// GET /api/topics — liste paginée
router.get('/', async (req, res) => {
  try {
    const { type, category, search, page = 1, limit = 20 } = req.query;
    const filter = {};
    if (type) filter.type = type;
    if (category) filter.category = category;
    if (search) filter.$text = { $search: search };

    const skip = (Number(page) - 1) * Number(limit);
    const [items, total] = await Promise.all([
      Topic.find(filter)
        .populate('author', 'username accessLevel')
        .sort({ isPinned: -1, createdAt: -1 })
        .skip(skip)
        .limit(Number(limit))
        .select('-links -resources -files'),
      Topic.countDocuments(filter),
    ]);
    res.json({ success: true, items, total, page: Number(page), pages: Math.ceil(total / Number(limit)) });
  } catch (error) {
    console.error('[TOPICS LIST]', error);
    res.status(500).json({ success: false, message: 'Erreur serveur.' });
  }
});

// GET /api/topics/:id — détail avec contrôle accès ressources
router.get('/:id', optionalAuth, async (req, res) => {
  try {
    const topic = await Topic.findById(req.params.id)
      .populate('author', 'username accessLevel specialization');
    if (!topic) return res.status(404).json({ success: false, message: 'Topic introuvable.' });

    topic.views += 1;
    await topic.save();

    const data = topic.toObject();
    const hasRestrictedContent = data.links.length > 0 || data.resources.length > 0 || data.files.length > 0;

    if (!req.user) {
      data.links = [];
      data.resources = [];
      data.files = [];
      data.hasRestrictedContent = hasRestrictedContent;
      data.isLocked = true;
    } else {
      data.hasRestrictedContent = hasRestrictedContent;
      data.isLocked = false;
    }
    res.json({ success: true, topic: data });
  } catch (error) {
    console.error('[TOPIC DETAIL]', error);
    res.status(500).json({ success: false, message: 'Erreur serveur.' });
  }
});

// POST /api/topics — créer (membre connecté)
router.post('/', protect, async (req, res) => {
  try {
    const { title, content, type, category, tags, links, resources, files } = req.body;
    const topic = await Topic.create({
      title, content, type, category,
      tags: tags || [],
      links: links || [],
      resources: resources || [],
      files: files || [],
      author: req.user._id,
    });
    await topic.populate('author', 'username accessLevel');
    res.status(201).json({ success: true, topic });
  } catch (error) {
    if (error.name === 'ValidationError') {
      return res.status(400).json({ success: false, message: Object.values(error.errors)[0].message });
    }
    console.error('[TOPIC CREATE]', error);
    res.status(500).json({ success: false, message: 'Erreur serveur.' });
  }
});

// PUT /api/topics/:id — modifier (auteur ou admin)
router.put('/:id', protect, async (req, res) => {
  try {
    const topic = await Topic.findById(req.params.id);
    if (!topic) return res.status(404).json({ success: false, message: 'Topic introuvable.' });

    const isOwner = topic.author.toString() === req.user._id.toString();
    const isAdmin = req.user.accessLevel === 'ADMIN';
    if (!isOwner && !isAdmin) return res.status(403).json({ success: false, message: 'Action non autorisée.' });

    const allowed = ['title', 'content', 'type', 'category', 'tags', 'links', 'resources', 'files'];
    allowed.forEach((f) => { if (req.body[f] !== undefined) topic[f] = req.body[f]; });
    if (isAdmin && req.body.isPinned !== undefined) topic.isPinned = req.body.isPinned;

    await topic.save();
    await topic.populate('author', 'username accessLevel');
    res.json({ success: true, topic });
  } catch (error) {
    if (error.name === 'ValidationError') {
      return res.status(400).json({ success: false, message: Object.values(error.errors)[0].message });
    }
    res.status(500).json({ success: false, message: 'Erreur serveur.' });
  }
});

// DELETE /api/topics/:id — supprimer (auteur ou admin)
router.delete('/:id', protect, async (req, res) => {
  try {
    const topic = await Topic.findById(req.params.id);
    if (!topic) return res.status(404).json({ success: false, message: 'Topic introuvable.' });

    const isOwner = topic.author.toString() === req.user._id.toString();
    const isAdmin = req.user.accessLevel === 'ADMIN';
    if (!isOwner && !isAdmin) return res.status(403).json({ success: false, message: 'Action non autorisée.' });

    await topic.deleteOne();
    res.json({ success: true, message: 'Topic supprimé.' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Erreur serveur.' });
  }
});

module.exports = router;
