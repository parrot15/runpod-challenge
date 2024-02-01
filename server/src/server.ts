import express from 'express';
import cors from 'cors';
import axios from 'axios';
// import fs from 'fs';
// import path from 'path';
import { Types } from 'mongoose';
import { v4 as uuidv4 } from 'uuid';
import {connectToMongoDB, storeImage} from './utils';
import {Run} from './models';
import { JobStatusType, ImageProps } from './types';

const app = express();
const port = 8000;
app.use(cors());

// Add body parsing middleware
app.use(express.json());

const API_KEY = 'P89BNAV2AYLQL1V470Y3SDHZ27AA96BE23KIDU2B';
// const ENDPOINT_ID = 'il5bv9m9q2jijl';

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
      imageUuids: [],
    });
    await newRun.save();

    // Send back the created run
    return res.status(200).json(newRun);
  } catch (error) {
    console.error(error);
    return res.status(500).send('Failed to store run.');
  }
});

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

  const apiUrl = `https://api.runpod.ai/v2/stable-diffusion-v1/status/${runToUpdate.jobId}`;
  const config = {
    headers: {
      accept: 'application/json',
      'content-type': 'application/json',
      authorization: API_KEY
    }
  };
  // try {
  // const response = await axios.get(apiUrl, config);
  let response; // Declare response variable outside the try block
  try {
    response = await axios.get(apiUrl, config);
    // Your logic to handle the response goes here
  } catch (error) {
    console.error(error);
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
    const images = response.data.output;
    const updatedImageUuids = await Promise.all(images.map(async ({image: imageUrl}: ImageProps) => {
      // Fetch image from Runpod based on provided URL
      let imageResponse;
      try {
        imageResponse = await axios.get(imageUrl, { responseType: 'arraybuffer' });
      } catch (error) {
        console.error(error);
        return res.status(500).send('Failed to store an image.');
      }

      // Save image locally
      const imageUuid = uuidv4();
      // const imagePath = path.join(__dirname, 'image-storage', `${imageUuid}.png`);
      // fs.writeFileSync(imagePath, imageResponse.data);
      await storeImage(`${imageUuid}.png`, imageResponse.data);

      return imageUuid;
    }));

    // Update run
    runToUpdate.updatedAt = new Date();
    runToUpdate.jobStatus = response.data.status;
    // runToUpdate.imageUuids.push(imageUuid);
    runToUpdate.imageUuids = updatedImageUuids;
    try {
      await runToUpdate.save();
    } catch (error) {
      console.error(error);
      res.status(500).send('Failed to update run.');
    }
    
    // Send back the updated run
    return res.status(200).json(runToUpdate);
  } else {
    // Job not complete, so just send back job ID and status
    return res.status(200).json({
      jobId: response.data.id,
      status: response.data.status
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