import express from 'express';
import { verifyToken } from '../utils/verifyToken.js';
import Attendance from '../models/Attendance.js';
import Lecture from '../models/Lecture.js';
import { allowRoles } from '../middleware/roleMiddleware.js';

const router = express.Router();

router.post('/mark', async (req, res) => {
  const { token } = req.body;
  try {
    const decoded = verifyToken(token);
    if (!decoded.lecture) return res.status(400).json({ message: 'Not a lecture token' });
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

router.get('/lecture/:id', allowRoles('teacher'), async (req, res) => {
  const list = await Attendance.find({ lectureId: req.params.id }).populate('studentId');
  return res.json(list);
});

export default router;
