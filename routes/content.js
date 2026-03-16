const express = require('express');
const Content = require('../models/Content');
const { protect, adminOnly } = require('../middleware/auth');

const router = express.Router();

// GET /api/content — liste avec filtres
router.get('/', async (req, res) => {
  try {
    const { type, category, search, page = 1, limit = 20 } = req.query;
    const filter = { isPublic: true };

    if (type) filter.type = type;
    if (category) filter.category = category;
    if (search) {
      filter.$text = { $search: search };
    }

    const skip = (Number(page) - 1) * Number(limit);
    const [items, total] = await Promise.all([
      Content.find(filter)
        .populate('author', 'username')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(Number(limit)),
      Content.countDocuments(filter),
    ]);

    res.json({
      success: true,
      items,
      total,
      page: Number(page),
      pages: Math.ceil(total / Number(limit)),
    });
  } catch (error) {
    console.error('[CONTENT LIST]', error);
    res.status(500).json({ success: false, message: 'Erreur serveur.' });
  }
});

// GET /api/content/counts — nombre de documents par catégorie
router.get('/counts', async (req, res) => {
  try {
    const counts = await Content.aggregate([
      { $match: { isPublic: true } },
      { $group: { _id: '$category', count: { $sum: 1 } } },
    ]);
    const result = {};
    counts.forEach((c) => { result[c._id] = c.count; });
    res.json({ success: true, counts: result });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Erreur serveur.' });
  }
});

// GET /api/content/:id
router.get('/:id', async (req, res) => {
  try {
    const item = await Content.findById(req.params.id).populate('author', 'username accessLevel');
    if (!item || !item.isPublic) return res.status(404).json({ success: false, message: 'Introuvable.' });

    // Incrémenter les vues
    item.views += 1;
    await item.save();

    res.json({ success: true, item });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Erreur serveur.' });
  }
});

// POST /api/content — créer (admin seulement)
router.post('/', protect, adminOnly, async (req, res) => {
  try {
    const { title, description, content, type, category, tags, source, isPublic } = req.body;
    const item = await Content.create({
      title, description, content, type, category,
      tags: tags || [],
      source: source || '',
      isPublic: isPublic !== false,
      author: req.user._id,
    });
    res.status(201).json({ success: true, item });
  } catch (error) {
    if (error.name === 'ValidationError') {
      return res.status(400).json({ success: false, message: Object.values(error.errors)[0].message });
    }
    res.status(500).json({ success: false, message: 'Erreur serveur.' });
  }
});

// PUT /api/content/:id — modifier (admin seulement)
router.put('/:id', protect, adminOnly, async (req, res) => {
  try {
    const item = await Content.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!item) return res.status(404).json({ success: false, message: 'Introuvable.' });
    res.json({ success: true, item });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Erreur serveur.' });
  }
});

// DELETE /api/content/:id — supprimer (admin seulement)
router.delete('/:id', protect, adminOnly, async (req, res) => {
  try {
    await Content.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Contenu supprimé.' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Erreur serveur.' });
  }
});

module.exports = router;
