import mongoose from 'mongoose';

const lectureSchema = new mongoose.Schema(
  {
    teacherId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    subject: { type: String, required: true },
    startTime: { type: Date, required: true },
    expiresAt: { type: Date, required: true },
    qrToken: { type: String, required: true },
  },
  { timestamps: true }
);

export default mongoose.model('Lecture', lectureSchema);
