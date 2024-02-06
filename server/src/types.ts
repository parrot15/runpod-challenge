export enum JobStatusType {
  InQueue = 'IN_QUEUE',
  InProgress = 'IN_PROGRESS',
  Completed = 'COMPLETED',
  Failed = 'FAILED',
  Canceled = 'CANCELLED',
  TimedOut = 'TIMED_OUT',
}

export interface ImageProps {
  image: string;
}
