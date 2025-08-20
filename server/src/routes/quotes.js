import express from 'express';
import Quote from '../models/Quote.js';

const router = express.Router();

// GET /api/quotes/random
router.get('/random', async (req, res) => {
  try {
    const [random] = await Quote.aggregate([{ $sample: { size: 1 } }]);
    if (!random) return res.status(404).json({ message: 'No quotes found' });
    res.json(random);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// GET /api/quotes
// supports ?search=&tag=&page=&limit=
router.get('/', async (req, res) => {
  try {
    const { search = '', tag = '', page = 1, limit = 10 } = req.query;
    const q = {};
    if (search) {
      q.$text = { $search: search };
    }
    if (tag) {
      q.tags = { $in: [tag] };
    }

    const skip = (Number(page) - 1) * Number(limit);
    const [items, total] = await Promise.all([
      Quote.find(q).sort({ createdAt: -1 }).skip(skip).limit(Number(limit)),
      Quote.countDocuments(q)
    ]);
    res.json({ items, total, page: Number(page), pages: Math.ceil(total / Number(limit)) });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// POST /api/quotes
router.post('/', async (req, res) => {
  try {
    const { text, author, tags } = req.body;
    if (!text) return res.status(400).json({ message: 'Text is required' });
    const doc = await Quote.create({ text, author, tags });
    res.status(201).json(doc);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// PUT /api/quotes/:id
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const updated = await Quote.findByIdAndUpdate(id, req.body, { new: true });
    if (!updated) return res.status(404).json({ message: 'Quote not found' });
    res.json(updated);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// DELETE /api/quotes/:id
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Quote.findByIdAndDelete(id);
    if (!deleted) return res.status(404).json({ message: 'Quote not found' });
    res.json({ ok: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Seed route (GET/POST for convenience)
router.all('/seed', async (_req, res) => {
  try {
    const samples = [
      { text: 'The best way to predict the future is to create it.', author: 'Peter Drucker', tags: ['inspire', 'future'] },
      { text: 'What we know is a drop, what we don’t know is an ocean.', author: 'Isaac Newton', tags: ['wisdom'] },
      { text: 'Simplicity is the ultimate sophistication.', author: 'Leonardo da Vinci', tags: ['design', 'simplicity'] },
      { text: 'Stay hungry, stay foolish.', author: 'Steve Jobs', tags: ['startup', 'courage'] },
      { text: 'In the middle of difficulty lies opportunity.', author: 'Albert Einstein', tags: ['resilience'] }
    ];
    await Quote.deleteMany({});
    const docs = await Quote.insertMany(samples);
    res.json({ inserted: docs.length, docs });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;
