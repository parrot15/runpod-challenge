// export const STATUS_MESSAGES = {
//   inQueue: {value: 'IN_QUEUE', diplayText: 'Queued...'},
//   inProgress: {value: 'IN_PROGRESS', diplayText: 'Generating...'},
//   completed: {value: 'COMPLETED', diplayText: 'Completed!'},
//   failed: {value: 'FAILED', diplayText: 'Failed!'},
//   canceled: {value: 'CANCELLED', diplayText: 'Canceled!'},
//   timedOut: {value: 'TIMED_OUT', diplayText: 'Timed out!'},
// };

export enum JobStatusType {
  InQueue = 'IN_QUEUE',
  InProgress = 'IN_PROGRESS',
  Completed = 'COMPLETED',
  Failed = 'FAILED',
  Canceled = 'CANCELLED',
  TimedOut = 'TIMED_OUT'
};

export const JOB_STATUS_MESSAGES = {
  [JobStatusType.InQueue]: 'Queued...',
  [JobStatusType.InProgress]: 'Generating...',
  [JobStatusType.Completed]: 'Completed!',
  [JobStatusType.Failed]: 'Failed!',
  [JobStatusType.Canceled]: 'Canceled!',
  [JobStatusType.TimedOut]: 'Timed Out!'
};