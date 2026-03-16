const mongoose = require('mongoose');

const contentSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Le titre est requis'],
      trim: true,
      maxlength: [200, 'Titre trop long'],
    },
    description: {
      type: String,
      trim: true,
      maxlength: [500, 'Description trop longue'],
    },
    content: {
      type: String,
      trim: true,
    },
    type: {
      type: String,
      enum: ['dossier', 'archive', 'theorie', 'ressource'],
      required: [true, 'Le type est requis'],
    },
    category: {
      type: String,
      enum: ['archives', 'ancient', 'social', 'tech', 'consciousness', 'symbols'],
      required: [true, 'La catégorie est requise'],
    },
    tags: [{ type: String, trim: true }],
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    views: {
      type: Number,
      default: 0,
    },
    isPublic: {
      type: Boolean,
      default: true,
    },
    source: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

contentSchema.index({ type: 1 });
contentSchema.index({ category: 1 });
contentSchema.index({ title: 'text', description: 'text', content: 'text' });

module.exports = mongoose.model('Content', contentSchema);
