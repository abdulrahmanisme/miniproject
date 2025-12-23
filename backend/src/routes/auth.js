import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';

const router = express.Router();
const jwtSecret = process.env.JWT_SECRET || 'devsecret';

router.post('/register', async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ message: 'Email already used' });
    const hashed = await bcrypt.hash(password, 10);
    const user = await User.create({ name, email, password: hashed, role });
    return res.json({ message: 'Registered', user: { id: user._id, email: user.email } });
  } catch (e) {
    return res.status(500).json({ message: 'Register failed', error: e.message });
  }
});

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: 'No user' });
    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(400).json({ message: 'Bad credentials' });
    const token = jwt.sign({ id: user._id, role: user.role, email: user.email }, jwtSecret, { expiresIn: '1d' });
    res.cookie('token', token, { httpOnly: true, sameSite: 'lax' });
    return res.json({ message: 'Logged in', user: { id: user._id, role: user.role, email: user.email } });
  } catch (e) {
    return res.status(500).json({ message: 'Login failed', error: e.message });
  }
});

export default router;
