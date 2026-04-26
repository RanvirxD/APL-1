import express from 'express';
import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

const router = express.Router();

router.post('/nudge', async (req, res) => {
  try {
    const { zones } = req.body;
    const prompt = `You are an AI assistant for a large sports venue.
Current zone data: ${JSON.stringify(zones)}
Give ONE short proactive tip for an attendee in plain English.
Max 20 words. No emojis. Be specific about zones and wait times.`;
    const result = await model.generateContent(prompt);
    const text = result.response.text();
    res.json({ nudge: text });
  } catch (err) {
    console.error('Gemini nudge error:', err);
    res.status(500).json({ nudge: 'Head to Gate C for fastest entry right now.' });
  }
});

router.post('/ops-alert', async (req, res) => {
  try {
    const { zones } = req.body;
    const prompt = `You are a venue operations assistant.
Current zone data: ${JSON.stringify(zones)}
Identify the biggest crowd risk right now and give ONE
plain English action for staff. Max 25 words. No emojis.`;
    const result = await model.generateContent(prompt);
    const text = result.response.text();
    res.json({ alert: text });
  } catch (err) {
    console.error('Gemini ops error:', err);
    res.status(500).json({ alert: 'Deploy staff to Food Court immediately. Density critical.' });
  }
});

export default router;