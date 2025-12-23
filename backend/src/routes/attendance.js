import express from 'express';
import jwt from 'jsonwebtoken';
import Attendance from '../models/Attendance.js';
import Lecture from '../models/Lecture.js';

const router = express.Router();
const jwtSecret = process.env.JWT_SECRET || 'devsecret';

router.post('/mark', async (req, res) => {
  const { token } = req.body;
  try {
    const decoded = jwt.verify(token, jwtSecret);
    if (!decoded.lecture) return res.status(400).json({ message: 'Not lecture token' });
    const lecture = await Lecture.findOne({ qrToken: token });
    if (!lecture) return res.status(404).json({ message: 'Lecture missing' });
    if (new Date() > lecture.expiresAt) return res.status(400).json({ message: 'QR expired' });

    await Attendance.create({ lectureId: lecture._id, studentId: req.user.id });
    return res.json({ message: 'Attendance marked' });
  } catch (e) {
    return res.status(400).json({ message: 'Invalid token', error: e.message });
  }
});

router.get('/student', async (req, res) => {
  const list = await Attendance.find({ studentId: req.user.id }).populate('lectureId');
  return res.json(list);
});

router.get('/lecture/:id', async (req, res) => {
  if (req.user.role !== 'teacher') return res.status(403).json({ message: 'Only teacher' });
  const list = await Attendance.find({ lectureId: req.params.id }).populate('studentId');
  return res.json(list);
});

export default router;
