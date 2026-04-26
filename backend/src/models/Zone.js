import mongoose from 'mongoose';

const zoneSchema = new mongoose.Schema({
  zoneId: String,
  name: String,
  density: Number,
  waitTime: Number,
  status: String,
  capacity: Number,
  currentCount: Number,
  updatedAt: { type: Date, default: Date.now }
});

export default mongoose.model('Zone', zoneSchema);
