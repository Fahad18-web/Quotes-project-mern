import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import path from 'path';
import { fileURLToPath } from 'url';
import connectDB from './utils/db.js';
import quotesRouter from './routes/quotes.js';

const app = express();
const PORT = process.env.PORT || 5000;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Security & utils
app.use(helmet());
app.use(morgan('dev'));
app.use(express.json({ limit: '1mb' }));

// CORS
const corsOrigin = process.env.CORS_ORIGIN || 'http://localhost:5173';
app.use(cors({ origin: corsOrigin, credentials: true }));

// Rate Limiter
const limiter = rateLimit({
  windowMs: 60 * 1000,
  max: 120,
  standardHeaders: true,
  legacyHeaders: false,
});
app.use(limiter);

// Routes
app.get('/api/health', (req, res) => res.json({ ok: true, time: new Date().toISOString() }));
app.use('/api/quotes', quotesRouter);

// Optional: serve production build of client
const distPath = path.resolve(__dirname, '../../client/dist');
app.use(express.static(distPath));
app.get('*', (req, res, next) => {
  // only serve index.html if it exists (build done)
  res.sendFile(path.join(distPath, 'index.html'), (err) => {
    if (err) next();
  });
});

// Start
(async () => {
  try {
    await connectDB();
    app.listen(PORT, () => console.log(`API listening on http://localhost:${PORT}`));
  } catch (err) {
    console.error('Failed to start server:', err);
    process.exit(1);
  }
})();
