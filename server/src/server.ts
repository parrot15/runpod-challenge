import express from 'express';
import cors from 'cors';
import axios from 'axios';
// import fs from 'fs';
import path from 'path';
import { Types } from 'mongoose';
import { v4 as uuidv4 } from 'uuid';
import {connectToMongoDB, storeImage} from './utils';
import {Run} from './models';
import { JobStatusType } from './types';

const app = express();
const port = 8000;
app.use(cors());

// Add body parsing middleware
app.use(express.json());

const API_KEY = 'P89BNAV2AYLQL1V470Y3SDHZ27AA96BE23KIDU2B';
// const ENDPOINT_ID = 'il5bv9m9q2jijl';

// Serve images as static files
app.use('/static/images', express.static(path.resolve(__dirname, '..', 'image-storage')));

// Start new image generation
app.post('/api/runs', async (req, res) => {
  const prompt = req.body.prompt;
  if (!prompt) {
    return res.status(400).send('No prompt in request.');
  }

  const apiUrl = 'https://api.runpod.ai/v2/stable-diffusion-v1/run';
  const body = {
    input: {
      prompt: prompt,
      num_outputs: 1
    }
  }
  const config = {
    headers: {
      accept: 'application/json',
      'content-type': 'application/json',
      authorization: API_KEY
    }
  }
  const response = await axios.post(apiUrl, body, config);

  // Store run in database
  try {
    // imageUuids will be updated later when the run is finished
    const newRun = new Run({
      jobId: response.data.id,
      jobStatus: response.data.status,
      prompt: prompt,
    });
    await newRun.save();

    // Send back the created run
    return res.status(200).json(newRun);
  } catch (error) {
    console.error(error);
    return res.status(500).send('Failed to store run.');
  }
});

// Merge these into the same endpoint - ?state=processing,completed
// app.get('/api/runs', async (req, res) => {
//   const state = req.query.state;
//   if (state && state !== 'processing' && state !== 'completed') {
//     return res.status(400).send('Invalid value for state.');
//   }

//   const order = req.query.order;
//   if (order && order !== 'recent') {
//     return res.status(400).send(`Invalid value for order: '${order}'`);
//   }

//   const amount = parseInt(req.query.amount as string, 10) || 5;
//   if (amount && !Number.isInteger(amount)) {  // Not an integer
//     return res.status(400).send('Amount must be an integer.');
//   }
//   if (amount <= 0) {  // Negative integer
//     return res.status(400).send('Amount must be > 0.');
//   }

//   try {
//     let query = Run.find();
//     if (state === 'processing') {
//       query = Run.find({
//         jobStatus: { $in: [JobStatusType.InQueue, JobStatusType.InProgress] }
//       });
//     } else if (state === 'completed') {
//       query = Run.find({
//         jobStatus: JobStatusType.Completed
//       });
//     }
//     if (order === 'recent') {
//       query = query.sort({createdAt: -1});
//     }
//     if (amount)

//     const runs = await query;
//     return res.status(200).json(runs);
//   } catch (error) {
//     console.error(error);
//     return res.status(500).send('Failed to fetch runs.');
//   }
// });

// Get runs according to client specifications
// state - Whether to get runs currently processing or completed
// order - Whether to sort runs by recency
// amount - How many runs to get (all if not specified)
app.get('/api/runs', async (req, res) => {
  const { state, order, amount } = req.query;
  let query = Run.find();

  // Validate and handle state parameter
  if (state) {
    if (state === 'processing') {
      query = Run.find({
        jobStatus: { $in: [JobStatusType.InQueue, JobStatusType.InProgress] }
      });
    } else if (state === 'completed') {
      query = Run.find({
        jobStatus: JobStatusType.Completed
      });
    } else {
      return res.status(400).send(`Invalid value for state: ${state}.`);
    }
  }

  // Validate and handle order parameter
  if (order) {
    if (order === 'recent') {
      // Creation time from most recent to least recent
      query = query.sort({createdAt: -1});
    } else {
      return res.status(400).send(`Invalid value for order: ${order}.`);
    }
  }

  // Validate and handle amount parameter
  if (amount) {
    const amountNumber = parseInt(amount as string, 10) || 5;
    if (!Number.isInteger(amountNumber)) {  // Not an integer
      return res.status(400).send('Invalid value for amount: must be an integer.');
    }
    if (amountNumber <= 0) {  // Negative integer
      return res.status(400).send('Invalid value for amount: must be > 0.');
    }
    query = query.limit(amountNumber);
  }

  try {
    const runs = await query;
    return res.status(200).json(runs);
  } catch (error) {
    console.error(error);
    return res.status(500).send('Failed to fetch runs.');
  }
});



// Get all runs that are currently queued/in-progress
// app.get('/api/runs/processing', async (req, res) => {
//   const order = req.query.order;
//   if (order && order !== 'recent') {
//     return res.status(400).send(`Invalid value for order: '${order}'`);
//   }

//   try {
//     let query = Run.find({
//       jobStatus: { $in: [JobStatusType.InQueue, JobStatusType.InProgress] }
//     });
//     if (order === 'recent') {
//       query = query.sort({createdAt: -1});
//     }

//     const runs = await query;
//     return res.status(200).json(runs);
//   } catch (error) {
//     console.error(error);
//     return res.status(500).send('Failed to fetch ongoing runs.');
//   }
// });

// // Get all runs that are completed
// app.get('/api/runs/completed', async (req, res) => {
//   const order = req.query.order;
//   if (order && order !== 'recent') {
//     return res.status(400).send(`Invalid value for order: '${order}'`);
//   }

//   const amount = parseInt(req.query.amount as string, 10) || 5;
//   if (amount && !Number.isInteger(amount)) {  // Not an integer
//     return res.status(400).send('Amount must be an integer.');
//   }
//   if (amount <= 0) {  // Negative integer
//     return res.status(400).send('Amount must be > 0.');
//   }

//   try {
//     let query = Run.find({
//       jobStatus: JobStatusType.Completed
//     });
//     if (order === 'recent') {
//       query = query.sort({createdAt: -1});
//     }
//     if (amount) {

//     }

//     const runs = await query;
//     return res.status(200).json(runs);
//   } catch (error) {
//     console.error(error);
//     return res.status(500).send('Failed to fetch completed runs.');
//   }
// });

// Get generation status and results
app.get('/api/runs/:runId', async (req, res) => {
  const runId = req.params.runId;
  if (!runId || !Types.ObjectId.isValid(runId)) {
    return res.status(400).send('Invalid run ID.');
  }

  const runToUpdate = await Run.findById(runId);
  if (!runToUpdate) {
    return res.status(404).send('Run not found.');
  }
  console.log('runToUpdate:', JSON.stringify(runToUpdate));

  const apiUrl = `https://api.runpod.ai/v2/stable-diffusion-v1/status/${runToUpdate.jobId}`;
  console.log('apiUrl:', apiUrl);
  const config = {
    headers: {
      accept: 'application/json',
      'content-type': 'application/json',
      authorization: API_KEY
    }
  };
  // try {
  // const response = await axios.get(apiUrl, config);
  let response;
  try {
    response = await axios.get(apiUrl, config);
    // console.log(JSON.stringify(response.data));
  } catch (error) {
    // console.error(error);
    return res.status(500).send('Failed to check run status.');
  }

  if (response.data.status === JobStatusType.Completed) {
    // Job is complete, so store images and update run

    // const updatedImageUuids: string[] = [];

    // // Store all images
    // const images = response.data.output;
    // images.forEach(async ({image: imageUrl}: ImageProps) => {
    //   // Generate UUID for the image
    //   const imageUuid = uuidv4();

    //   // Fetch the image from Runpod based on provided URL
    //   // const imageUrl = image.image;
    //   const imageResponse = await axios.get(imageUrl, { responseType: 'arraybuffer' });
    //   // Save image locally
    //   const imagePath = path.join(__dirname, 'image-storage', `${imageUuid}.png`);
    //   fs.writeFileSync(imagePath, imageResponse.data);

    //   updatedImageUuids.push(imageUuid);
    // });

    // Concurrently fetch and store all images, and
    // asynchronously wait until all operations are complete
    // const images = response.data.output;
    // const updatedImageUuids = await Promise.all(images.map(async ({image: imageUrl}: ImageProps) => {
    //   // Fetch image from Runpod based on provided URL
    //   let imageResponse;
    //   try {
    //     imageResponse = await axios.get(imageUrl, { responseType: 'arraybuffer' });
    //   } catch (error) {
    //     console.error(error);
    //     return res.status(500).send('Failed to store an image.');
    //   }

    //   // Save image locally
    //   const imageUuid = uuidv4();
    //   // const imagePath = path.join(__dirname, 'image-storage', `${imageUuid}.png`);
    //   // fs.writeFileSync(imagePath, imageResponse.data);
    //   await storeImage(`${imageUuid}.png`, imageResponse.data);

    //   return imageUuid;
    // }));
    // Fetch image from Runpod based on provided URL
    let imageResponse;
    try {
      const imageUrl = response.data.output[0].image;
      console.log('imageUrl:', imageUrl);
      imageResponse = await axios.get(imageUrl, { responseType: 'arraybuffer' });
    } catch (error) {
      console.error(error);
      return res.status(500).send('Failed to retrieve image from Runpod.');
    }

    // Save image locally
    const imageUuid = uuidv4();
    await storeImage(`${imageUuid}.png`, imageResponse.data);

    // Update run
    runToUpdate.updatedAt = new Date();
    runToUpdate.jobStatus = response.data.status;
    // runToUpdate.imageUuids.push(imageUuid);
    runToUpdate.imageUuid = imageUuid;
    try {
      await runToUpdate.save();
    } catch (error) {
      console.error(error);
      return res.status(500).send('Failed to update run.');
    }
    
    // Send back the updated run
    return res.status(200).json(runToUpdate);
  } else {
    // Job not complete, so just send back job ID and status
    return res.status(200).json({
      jobId: response.data.id,
      jobStatus: response.data.status
    });
  }
  // } catch (error) {
  //   console.error(error);
  //   return res.status(500).send('Failed to check run status.');
  // }
});

app.listen(port, () => {
  connectToMongoDB();
  console.log(`Server is running on http://localhost:${port}`);
});