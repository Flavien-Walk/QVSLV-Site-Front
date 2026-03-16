require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');

const app = express();

// Connexion MongoDB
connectDB();

// Middlewares
const ALLOWED_ORIGINS = (process.env.CORS_ORIGINS || '')
  .split(',')
  .map((o) => o.trim())
  .filter(Boolean);

app.use(cors({
  origin: (origin, cb) => {
    if (!origin) return cb(null, true);
    const allowed = [
      'http://localhost:5173',
      'http://localhost:3001',
      ...ALLOWED_ORIGINS,
    ];
    if (allowed.includes(origin) || /\.vercel\.app$/.test(origin)) {
      cb(null, true);
    } else {
      cb(new Error('CORS: origine non autorisée'));
    }
  },
  credentials: true,
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/content', require('./routes/content'));
app.use('/api/messages', require('./routes/messages'));
app.use('/api/topics',   require('./routes/topics'));

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'QVSLV Backend opérationnel', timestamp: new Date().toISOString() });
});

// 404
app.use((req, res) => {
  res.status(404).json({ success: false, message: 'Route introuvable.' });
});

// Error handler global
app.use((err, req, res, next) => {
  console.error('[SERVER ERROR]', err);
  res.status(500).json({ success: false, message: 'Erreur serveur interne.' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`[QVSLV] Serveur lancé sur le port ${PORT}`);
});
