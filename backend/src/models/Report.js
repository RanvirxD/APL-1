import mongoose from 'mongoose';

const reportSchema = new mongoose.Schema({
  type: String,
  severity: String,
  location: String,
  description: String,
  imageUrl: String,
  status: { type: String, default: 'pending' },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model('Report', reportSchema);
