import mongoose from 'mongoose';

const attendanceSchema = new mongoose.Schema(
  {
    lectureId: { type: mongoose.Schema.Types.ObjectId, ref: 'Lecture', required: true },
    studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    timestamp: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

attendanceSchema.index({ lectureId: 1, studentId: 1 }, { unique: true });

export default mongoose.model('Attendance', attendanceSchema);
