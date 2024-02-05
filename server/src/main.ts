import path from 'path';
import express from 'express';
import cors from 'cors';
import {connectToMongoDB} from './utils';
import endpoints from './endpoints';
import config from './config/config.json';

const app = express();
app.use(cors());

// Add body parsing middleware
app.use(express.json());

// Add endpoints
app.use('/api', endpoints);

// Serve images statically
app.use('/static/images', express.static(path.resolve(config.imageDir)));

app.listen(config.port, () => {
  connectToMongoDB();
  console.log(`Server is running on http://localhost:${config.port}`);
});