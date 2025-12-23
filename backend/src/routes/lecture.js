import express from 'express';
import jwt from 'jsonwebtoken';
import QRCode from 'qrcode';
import Lecture from '../models/Lecture.js';

const router = express.Router();
const jwtSecret = process.env.JWT_SECRET || 'devsecret';

router.post('/create', async (req, res) => {
  if (req.user.role !== 'teacher') return res.status(403).json({ message: 'Only teacher' });
  const { subject, durationMinutes = 10 } = req.body;
  const startTime = new Date();
  const expiresAt = new Date(startTime.getTime() + durationMinutes * 60000);

  const qrToken = jwt.sign({ lecture: true, teacherId: req.user.id, subject }, jwtSecret, {
    expiresIn: `${durationMinutes}m`,
  });

  const lecture = await Lecture.create({
    teacherId: req.user.id,
    subject,
    startTime,
    expiresAt,
    qrToken,
  });

  const qrDataUrl = await QRCode.toDataURL(qrToken);
  return res.json({ lectureId: lecture._id, qrDataUrl, token: qrToken, expiresAt });
});

router.get('/:id', async (req, res) => {
  const lecture = await Lecture.findById(req.params.id);
  if (!lecture) return res.status(404).json({ message: 'Not found' });
  return res.json(lecture);
});

export default router;
