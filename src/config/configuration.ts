import { config } from 'dotenv';
config();

export const configs = {
  mongoUrl: process.env.MONGO_URL || 'mongodb://localhost/building-a-migration-system-with-nest-and-mongoose',
}
