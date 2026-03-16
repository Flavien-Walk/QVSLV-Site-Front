const mongoose = require('mongoose');

const linkSchema = new mongoose.Schema({
  label: { type: String, trim: true, maxlength: 100 },
  url:   { type: String, trim: true, maxlength: 500 },
}, { _id: false });

const resourceSchema = new mongoose.Schema({
  label:       { type: String, trim: true, maxlength: 150 },
  url:         { type: String, trim: true, maxlength: 500 },
  description: { type: String, trim: true, maxlength: 300 },
}, { _id: false });

const fileSchema = new mongoose.Schema({
  name: { type: String, trim: true, maxlength: 200 },
  url:  { type: String, trim: true, maxlength: 500 },
  size: { type: Number, default: 0 },
  mime: { type: String, trim: true },
}, { _id: false });

const topicSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Le titre est requis'],
      trim: true,
      maxlength: [200, 'Titre trop long (200 caractères max)'],
    },
    content: {
      type: String,
      required: [true, 'Le contenu est requis'],
      trim: true,
      maxlength: [10000, 'Contenu trop long (10 000 caractères max)'],
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
    tags: [{ type: String, trim: true, maxlength: 50 }],
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    links:     { type: [linkSchema],     default: [] },
    resources: { type: [resourceSchema], default: [] },
    files:     { type: [fileSchema],     default: [] },
    views:    { type: Number,  default: 0 },
    isPinned: { type: Boolean, default: false },
  },
  { timestamps: true }
);

topicSchema.index({ type: 1 });
topicSchema.index({ category: 1 });
topicSchema.index({ author: 1 });
topicSchema.index({ title: 'text', content: 'text' });

module.exports = mongoose.model('Topic', topicSchema);
