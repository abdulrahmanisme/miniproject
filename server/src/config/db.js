import mongoose from 'mongoose';

export async function connectDB() {
  const uri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/attendance';
  await mongoose.connect(uri);
  console.log('Mongo connected');
}
