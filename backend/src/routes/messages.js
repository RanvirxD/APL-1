import express from 'express';
import Message from '../models/Message.js';

const router = express.Router();

router.get('/messages', async (req, res) => {
  try {
    const messages = await Message.find().sort({ createdAt: 1 });
    res.json(messages);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/messages', async (req, res) => {
  try {
    const { senderName, senderRole, text } = req.body;
    const badWords = ['damn', 'hell', 'crap', 'idiot', 'stupid', 'hate'];
    let filtered = false;
    let originalText = null;
    let cleanText = text;

    badWords.forEach((word) => {
      if (text.toLowerCase().includes(word)) {
        filtered = true;
        originalText = text;
        cleanText = cleanText.replace(new RegExp(word, 'gi'), '****');
      }
    });

    const message = await Message.create({
      senderName,
      senderRole,
      text: cleanText,
      filtered,
      originalText,
    });

    res.json({ success: true, message });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
