import { Schema, model } from 'mongoose';
import { JobStatusType } from './types';

const RunSchema = new Schema({
  createdAt: { type: Date, default: () => Date.now() },
  updatedAt: { type: Date, default: () => Date.now() },
  jobId: { type: String, required: true },
  jobStatus: {
    type: String,
    enum: Object.values(JobStatusType),
    required: true,
  },
  prompt: { type: String, required: true },
  imageUuid: { type: String },
});

export const Run = model('Run', RunSchema);
