const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: [true, 'Le prénom est requis'],
      trim: true,
    },
    lastName: {
      type: String,
      required: [true, 'Le nom est requis'],
      trim: true,
    },
    username: {
      type: String,
      required: [true, "Le nom d'utilisateur est requis"],
      trim: true,
      minlength: [3, "Le nom d'utilisateur doit faire au moins 3 caractères"],
      maxlength: [30, "Le nom d'utilisateur ne peut pas dépasser 30 caractères"],
    },
    email: {
      type: String,
      required: [true, "L'email est requis"],
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, 'Email invalide'],
    },
    password: {
      type: String,
      required: [true, 'Le mot de passe est requis'],
      minlength: [6, 'Le mot de passe doit faire au moins 6 caractères'],
      select: false,
    },
    specialization: {
      type: String,
      enum: ['archives', 'ancient', 'social', 'tech', 'consciousness', 'symbols', 'crypto', 'research'],
      required: [true, 'La spécialisation est requise'],
    },
    motivation: {
      type: String,
      trim: true,
      maxlength: [500, 'La motivation ne peut pas dépasser 500 caractères'],
    },
    accessLevel: {
      type: String,
      enum: ['ANONYME', 'VÉRIFIÉ', 'ADMIN'],
      default: 'VÉRIFIÉ',
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    lastLogin: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

// Hash du mot de passe avant sauvegarde
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

// Méthode pour vérifier le mot de passe
userSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// Méthode pour retourner l'user sans données sensibles
userSchema.methods.toPublic = function () {
  return {
    id: this._id,
    firstName: this.firstName,
    lastName: this.lastName,
    username: this.username,
    email: this.email,
    specialization: this.specialization,
    motivation: this.motivation,
    accessLevel: this.accessLevel,
    createdAt: this.createdAt,
    lastLogin: this.lastLogin,
  };
};

// Index uniques définis séparément (Mongoose 8+)
userSchema.index({ username: 1 }, { unique: true });
userSchema.index({ email: 1 }, { unique: true });

module.exports = mongoose.model('User', userSchema);
