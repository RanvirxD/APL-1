import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './src/db/connect.js';
import zonesRouter from './src/routes/zones.js';
import geminiRouter from './src/routes/gemini.js';
import reportsRouter from './src/routes/reports.js';
import messagesRouter from './src/routes/messages.js';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

connectDB();

app.use('/api', zonesRouter);
app.use('/api', geminiRouter);
app.use('/api', reportsRouter);
app.use('/api', messagesRouter);

app.listen(3001, () => {
  console.log('ArenaIQ backend running on port 3001');
});