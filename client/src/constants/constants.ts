export enum JobStatusType {
  InQueue = 'IN_QUEUE',
  InProgress = 'IN_PROGRESS',
  Completed = 'COMPLETED',
  Failed = 'FAILED',
  Canceled = 'CANCELLED',
  TimedOut = 'TIMED_OUT',
}

export const JOB_STATUS_MESSAGES = {
  [JobStatusType.InQueue]: 'Queued...',
  [JobStatusType.InProgress]: 'Generating...',
  [JobStatusType.Completed]: 'Completed!',
  [JobStatusType.Failed]: 'Failed!',
  [JobStatusType.Canceled]: 'Canceled!',
  [JobStatusType.TimedOut]: 'Timed Out!',
};
