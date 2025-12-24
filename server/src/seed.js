import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import { connectDB } from './config/db.js';
import User from './models/User.js';

dotenv.config();

async function seed() {
  await connectDB();
  await User.deleteMany({});
  const password = await bcrypt.hash('password123', 10);
  await User.insertMany([
    { name: 'Alice Student', email: 'student@example.com', password, role: 'student' },
    { name: 'Tom Teacher', email: 'teacher@example.com', password, role: 'teacher' },
    { name: 'Amy Admin', email: 'admin@example.com', password, role: 'admin' },
  ]);
  console.log('✅ Seeded users successfully!');
  console.log('Student: student@example.com / password123');
  console.log('Teacher: teacher@example.com / password123');
  console.log('Admin: admin@example.com / password123');
  process.exit();
}

seed();
