import express from 'express';
import { allowRoles } from '../middleware/roleMiddleware.js';
import { signToken } from '../utils/verifyToken.js';
import { generateQR } from '../utils/generateQR.js';
import Lecture from '../models/Lecture.js';

const router = express.Router();

router.post('/create', allowRoles('teacher'), async (req, res) => {
  const { subject, durationMinutes = 10 } = req.body;
  const start = new Date();
  const expiresAt = new Date(start.getTime() + durationMinutes * 60000);
  const qrToken = signToken({ lecture: true, teacherId: req.user.id, subject }, `${durationMinutes}m`);

  const lecture = await Lecture.create({ teacherId: req.user.id, subject, qrToken, expiresAt });
  const qrDataUrl = await generateQR(qrToken);
  return res.json({ lectureId: lecture._id, qrToken, qrDataUrl, expiresAt });
});

router.get('/:id', async (req, res) => {
  const lecture = await Lecture.findById(req.params.id);
  if (!lecture) return res.status(404).json({ message: 'Lecture not found' });
  return res.json(lecture);
});

export default router;
