import express from 'express';
import User from '../models/User.js';
import Lecture from '../models/Lecture.js';
import Attendance from '../models/Attendance.js';
import { authRequired } from '../middleware/authMiddleware.js';
import { adminOnly } from '../middleware/roleMiddleware.js';

const router = express.Router();

// Apply authentication and admin role check to all routes
router.use(authRequired);
router.use(adminOnly);

// Get all users
router.get('/users', async (req, res) => {
  try {
    const users = await User.find({}).select('-password').sort({ createdAt: -1 });
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete a user
router.delete('/users/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    // Prevent deleting admin users
    if (user.role === 'admin') {
      return res.status(403).json({ message: 'Cannot delete admin users' });
    }
    
    await User.findByIdAndDelete(req.params.id);
    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get all lectures
router.get('/lectures', async (req, res) => {
  try {
    console.log('Admin fetching lectures...');
    const lectures = await Lecture.find({})
      .populate('teacherId', 'name email')
      .sort({ createdAt: -1 });
    console.log('Found lectures:', lectures.length);
    res.json(lectures);
  } catch (error) {
    console.error('Error fetching lectures:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get all attendance records
router.get('/attendances', async (req, res) => {
  try {
    console.log('Admin fetching attendances...');
    const attendances = await Attendance.find({})
      .populate('student', 'name email')
      .populate('lecture', 'title')
      .sort({ timestamp: -1 });
    console.log('Found attendances:', attendances.length);
    res.json(attendances);
  } catch (error) {
    console.error('Error fetching attendances:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Delete attendance record
router.delete('/attendances/:id', async (req, res) => {
  try {
    const attendance = await Attendance.findByIdAndDelete(req.params.id);
    if (!attendance) {
      return res.status(404).json({ message: 'Attendance record not found' });
    }
    res.json({ message: 'Attendance record deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;
