import dotenv from 'dotenv';
import { connectDB } from './src/config/db.js';
import { createServer } from './src/app.js';

dotenv.config();

const PORT = process.env.PORT || 4000;

async function start() {
  await connectDB();
  const app = createServer();
  app.listen(PORT, () => console.log(`API running on port ${PORT}`));
}

start().catch((err) => {
  console.error('Startup error', err);
  process.exit(1);
});
