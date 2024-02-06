'use client';

import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import api from '@/config/api';
import RunPreview from '@/components/RunPreview';
import { RunProps } from '@/types/types';
import { JobStatusType } from '@/constants/constants';

/**
 * Displays user's library of completed runs.
 */
const Page = () => {
  const [completedRuns, setCompletedRuns] = useState<RunProps[]>([]);

  useEffect(() => {
    loadCompletedRuns();
  }, []);

  const loadCompletedRuns = async () => {
    let runData;
    try {
      const response = await api.get('/runs', {
        params: {
          state: 'completed',
          order: 'recent',
        },
      });
      runData = response.data;
    } catch (error) {
      toast.error('Failed to get completed runs.');
      return;
    }
    setCompletedRuns(runData);
  };

  return (
    <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 justify-items-center">
      {completedRuns.map((run, idx) => (
        <RunPreview
          key={idx}
          runId={run._id}
          imageUuid={run.imageUuid}
          jobStatus={run.jobStatus as JobStatusType}
          prompt={run.prompt}
          createdAt={new Date(run.createdAt)}
        />
      ))}
    </div>
  );
};
export default Page;
