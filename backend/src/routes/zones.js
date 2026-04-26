import express from 'express';
import { zones, alerts, match } from '../data/zones.js';

const router = express.Router();

router.get('/zones', (req, res) => {
  res.json(zones);
});

router.get('/alerts', (req, res) => {
  res.json(alerts);
});

router.get('/match', (req, res) => {
  res.json(match);
});

router.post('/report', (req, res) => {
  console.log(req.body);
  res.json({ success: true, message: "Report received" });
});

export default router;