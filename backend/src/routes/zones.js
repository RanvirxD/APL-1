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

export default router;