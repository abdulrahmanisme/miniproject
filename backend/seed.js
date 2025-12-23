import mongoose from 'mongoose';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import User from './src/models/User.js';

dotenv.config();

async function seed() {
  await mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/attendance');
  await User.deleteMany({});
  const password = await bcrypt.hash('password123', 10);
  await User.insertMany([
    { name: 'Alice Student', email: 'student@example.com', password, role: 'student' },
    { name: 'Tom Teacher', email: 'teacher@example.com', password, role: 'teacher' },
    { name: 'Amy Admin', email: 'admin@example.com', password, role: 'admin' },
  ]);
  console.log('Seeded users');
  process.exit();
}
seed();
