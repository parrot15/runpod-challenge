export interface RunProps {
  _id: string;
  createdAt: Date | string;
  updatedAt: Date | string;
  jobId: string;
  jobStatus: string;
  prompt: string;
  imageUuid: string;
}
