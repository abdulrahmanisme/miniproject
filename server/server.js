import dotenv from 'dotenv';
import { connectDB } from './src/config/db.js';
import { createServer } from './src/app.js';

dotenv.config();

const PORT = process.env.PORT || 4000;

// Initialize database connection
let isConnected = false;

async function ensureDbConnection() {
  if (!isConnected) {
    await connectDB();
    isConnected = true;
  }
}

// For Vercel serverless
const app = createServer();

// Vercel serverless handler
export default async function handler(req, res) {
  await ensureDbConnection();
  return app(req, res);
}

// For local development
if (process.env.NODE_ENV !== 'production') {
  async function start() {
    await connectDB();
    app.listen(PORT, () => console.log(`API running on port ${PORT}`));
  }

  start().catch((err) => {
    console.error('Startup error', err);
    process.exit(1);
  });
}
