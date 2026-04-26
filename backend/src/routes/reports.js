import express from 'express';
import Report from '../models/Report.js';

const router = express.Router();

router.post('/report', async (req, res) => {
  try {
    const { type, severity, location, description } = req.body;
    const report = await Report.create({
      type,
      severity,
      location,
      description,
    });
    res.json({ success: true, report });
  } catch (err) {
    console.error('Report error:', err);
    res.status(500).json({ success: false });
  }
});

router.get('/reports', async (req, res) => {
  try {
    const reports = await Report.find().sort({ createdAt: -1 });
    res.json(reports);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
