import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import User from './models/User.js';
import dotenv from 'dotenv';

dotenv.config();

const seedAdminUser = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✓ Connected to MongoDB');

    // Clear existing users (fresh start)
    await User.deleteMany({});
    console.log('✓ Cleared existing users');

    // Hash password
    const hashedPassword = await bcrypt.hash('admin123', 10);

    // Create admin user
    const admin = await User.create({
      name: 'Admin User',
      email: 'admin@admin.com',
      password: hashedPassword,
      role: 'admin',
    });

    console.log('✓ Admin user created successfully!');
    console.log('\n📧 Login Credentials:');
    console.log('   Email: admin@admin.com');
    console.log('   Password: admin123');
    console.log('   Role: admin\n');

    await mongoose.connection.close();
    console.log('✓ Database connection closed');
    process.exit(0);
  } catch (error) {
    console.error('❌ Seed error:', error);
    process.exit(1);
  }
};

seedAdminUser();
