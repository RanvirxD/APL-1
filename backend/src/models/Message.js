import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema({
  senderName: String,
  senderRole: { type: String, enum: ['user', 'admin', 'ai'] },
  text: String,
  filtered: { type: Boolean, default: false },
  originalText: String,
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model('Message', messageSchema);
