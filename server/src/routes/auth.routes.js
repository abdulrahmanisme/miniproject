import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { jwtConfig } from '../config/jwt.js';

const router = express.Router();

router.post('/register', async (req, res) => {
  try {
    const { name, email, password, role = 'student' } = req.body;
    const exists = await User.findOne({ email });
    if (exists) return res.status(400).json({ message: 'Email already used' });
    const hashed = await bcrypt.hash(password, 10);
    const user = await User.create({ name, email, password: hashed, role });
    return res.json({ id: user._id, email: user.email });
  } catch (e) {
    return res.status(500).json({ message: 'Register failed', error: e.message });
  }
});

router.post('/login', async (req, res) => {
  try {
    console.log('Login attempt:', { email: req.body?.email, hasPassword: !!req.body?.password });
    const { email, password } = req.body;
    
    if (!email || !password) {
      console.log('Missing credentials');
      return res.status(400).json({ message: 'Email and password required' });
    }
    
    const user = await User.findOne({ email });
    if (!user) {
      console.log('User not found:', email);
      return res.status(400).json({ message: 'User not found' });
    }
    
    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      console.log('Password mismatch for:', email);
      return res.status(400).json({ message: 'Bad credentials' });
    }
    
    const token = jwt.sign({ id: user._id, role: user.role, email: user.email }, jwtConfig.secret, {
      expiresIn: jwtConfig.expiresIn,
    });
    res.cookie('token', token, { httpOnly: true, sameSite: 'none', secure: true });
    console.log('Login successful:', email);
    return res.json({ 
      id: user._id, 
      role: user.role, 
      email: user.email,
      name: user.name,
      credentialId: user.credentialId || null
    });
  } catch (e) {
    console.error('Login error:', e);
    return res.status(500).json({ message: 'Login failed', error: e.message });
  }
});

router.post('/logout', (req, res) => {
  res.clearCookie('token');
  res.json({ message: 'Logged out' });
});

export default router;
