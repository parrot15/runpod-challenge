export interface RunPreviewProps {
  imageUuid: string,
  isLoading: boolean
};

export interface RunProps {
  _id: string,
  createdAt: Date,
  updatedAt: Date,
  jobId: string,
  jobStatus: string,
  prompt: string,
  imageUuid: string
};