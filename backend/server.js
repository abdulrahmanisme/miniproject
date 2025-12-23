import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';

import authRoutes from './src/routes/auth.js';
import webauthnRoutes from './src/routes/webauthn.js';
import lectureRoutes from './src/routes/lecture.js';
import attendanceRoutes from './src/routes/attendance.js';

import { authMiddleware } from './src/middleware/authMiddleware.js';

dotenv.config();

const app = express();
app.use(cors({ origin: process.env.CLIENT_URL || 'http://localhost:5173', credentials: true }));
app.use(cookieParser());
app.use(express.json());

app.get('/', (req, res) => res.send('Smart Classroom Attendance API'));
app.use('/auth', authRoutes);
app.use('/webauthn', authMiddleware.optional, webauthnRoutes);
app.use('/lecture', authMiddleware.required, lectureRoutes);
app.use('/attendance', authMiddleware.required, attendanceRoutes);

const PORT = process.env.PORT || 4000;
mongoose
  .connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/attendance')
  .then(() => {
    app.listen(PORT, () => console.log(`API running on port ${PORT}`));
  })
  .catch((err) => console.error('Mongo connection error', err));
