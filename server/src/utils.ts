import fs from 'fs/promises';
import path from 'path';
import mongoose from 'mongoose';
import config from './config/config.json';

export const connectToMongoDB = async () => {
  const dbHost = config.mongoDb.host;
  const dbPort = config.mongoDb.port;
  const dbName = config.mongoDb.dbName;
  const mongoUri = `mongodb://${dbHost}:${dbPort}/${dbName}`;
  try {
    await mongoose.connect(mongoUri);
    console.log('Connected to the database successfully.');
  } catch (error) {
    console.error('Database connection error:', error);
  }
};

export const storeImage = async (
  filename: string,
  data: string | NodeJS.ArrayBufferView,
) => {
  try {
    const imagePath = path.join(config.imageDir, filename);
    await fs.writeFile(imagePath, data);
  } catch (error) {
    console.error('Failed to store image:', error);
  }
};
