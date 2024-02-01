// import fs from 'fs';
// import { promises as fs } from 'fs';
import fs from 'fs/promises';
import path from 'path';
import mongoose from 'mongoose';

export const connectToMongoDB = () => {
  const dbName = 'runs_db';
  const mongoUri = `mongodb://localhost:27017/${dbName}`;
  mongoose.connect(mongoUri).then(() => {
    console.log('Connected to the database successfully');
  }).catch(err => {
    console.error('Database connection error', err);
  });
};

export const storeImage = async (filename: string, data: string | NodeJS.ArrayBufferView) => {
  try {
    // const imagePath = path.join(__dirname, 'image-storage', filename);
    const imagePath = path.resolve(__dirname, '..', 'image-storage', filename);
    await fs.writeFile(imagePath, data);
  } catch (error) {
    console.error('Failed to store image:', error);
  }
};