import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import authRoutes from './routes/auth.routes.js';
import lectureRoutes from './routes/lecture.routes.js';
import attendanceRoutes from './routes/attendance.routes.js';
import webauthnRoutes from './routes/webauthn.routes.js';
import adminRoutes from './routes/admin.routes.js';
import { authRequired, authOptional } from './middleware/authMiddleware.js';

export function createServer() {
  const app = express();
  app.use(cors({ origin: process.env.CLIENT_URL || 'http://localhost:5173', credentials: true }));
  app.use(cookieParser());
  app.use(express.json());

  app.get('/', (_req, res) => res.send('Smart Classroom Attendance API'));

  app.use('/auth', authRoutes);
  app.use('/webauthn', authOptional, webauthnRoutes);
  app.use('/lecture', authRequired, lectureRoutes);
  app.use('/attendance', authRequired, attendanceRoutes);
  app.use('/admin', adminRoutes);

  return app;
}
