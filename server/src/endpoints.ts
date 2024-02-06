import { v4 as uuidv4 } from 'uuid';
import express from 'express';
import axios from 'axios';
import { Types } from 'mongoose';
import api from './api';
import { storeImage } from './utils';
import { Run } from './models';
import { JobStatusType } from './types';

const router = express.Router();

/**
 * Starts a new image generation run. Accepts a prompt in the
 * request body, stores the run metadata in the database, and
 * returns the created run.
 */
router.post('/runs', async (req, res) => {
  const prompt = req.body.prompt;
  if (!prompt) {
    return res.status(400).send('No prompt in request.');
  }
  let response;
  try {
    response = await api.post('/run', {
      input: { prompt: prompt, num_outputs: 1 },
    });
  } catch (error) {
    console.error(error);
    return res.status(500).send('Failed to start run.');
  }

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

/**
 * Fetches runs based on query parameters.
 * state - Whether to get runs currently processing or completed
 * order - Whether to sort runs by recency
 * amount - How many runs to get (all if not specified)
 */
router.get('/runs', async (req, res) => {
  const { state, order, amount } = req.query;
  let query = Run.find();

  // Validate and handle state parameter
  if (state) {
    if (state === 'processing') {
      query = Run.find({
        jobStatus: { $in: [JobStatusType.InQueue, JobStatusType.InProgress] },
      });
    } else if (state === 'completed') {
      query = Run.find({
        jobStatus: JobStatusType.Completed,
      });
    } else {
      return res.status(400).send(`Invalid value for state: ${state}.`);
    }
  }

  // Validate and handle order parameter
  if (order) {
    if (order === 'recent') {
      // Creation time from most recent to least recent
      query = query.sort({ createdAt: -1 });
    } else {
      return res.status(400).send(`Invalid value for order: ${order}.`);
    }
  }

  // Validate and handle amount parameter
  if (amount) {
    const amountNumber = parseInt(amount as string, 10) || 5;
    if (!Number.isInteger(amountNumber)) {
      // Not an integer
      return res
        .status(400)
        .send('Invalid value for amount: must be an integer.');
    }
    if (amountNumber <= 0) {
      // Negative integer
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

/**
 * Fetches the status and results of a specific run. If the run
 * is completed, it retrieves the generated image from Runpod,
 * stores it locally, updates the run metadata, and returns the
 * updated run. If not completed, just returns the run's current
 * status.
 */
// Get generation status and results
router.get('/runs/:runId', async (req, res) => {
  const runId = req.params.runId;
  if (!runId || !Types.ObjectId.isValid(runId)) {
    return res.status(400).send('Invalid run ID.');
  }

  const runToUpdate = await Run.findById(runId);
  if (!runToUpdate) {
    return res.status(404).send('Run not found.');
  }

  let response;
  try {
    response = await api.get(`/status/${runToUpdate.jobId}`);
  } catch (error) {
    console.error(error);
    return res.status(500).send('Failed to check run status.');
  }

  if (response.data.status === JobStatusType.Completed) {
    // Job is complete, so store images and update run

    // Fetch image from Runpod based on provided URL
    let imageResponse;
    try {
      const imageUrl = response.data.output[0].image;
      imageResponse = await axios.get(imageUrl, {
        responseType: 'arraybuffer',
      });
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
      jobStatus: response.data.status,
    });
  }
});

export default router;
