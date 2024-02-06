'use client';

import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import api from '@/config/api';
import RunPreview from '@/components/RunPreview';
import UserInput from '@/components/UserInput';
import RecentRuns from '@/components/RecentRuns';
import { RunProps } from '@/types/types';
import { JobStatusType } from '@/constants/constants';

/**
 * Displays all processing runs and allows users to submit prompts for
 * new runs.
 */
const Page = () => {
  const [processingRuns, setProcessingRuns] = useState<RunProps[]>([]);

  useEffect(() => {
    loadProcessingRuns();
  }, []);

  const loadProcessingRuns = async () => {
    let runs;
    try {
      const response = await api.get('/runs', {
        params: {
          state: 'processing',
          order: 'recent',
        },
      });
      runs = response.data;
    } catch (error) {
      toast.error('Failed to get processing runs.');
      return;
    }
    setProcessingRuns(runs);
  };

  const sendPrompt = async (prompt: string) => {
    if (!prompt) {
      return;
    }

    let newRun: RunProps;
    try {
      const response = await api.post(
        '/runs',
        { prompt: prompt },
        { timeout: 3000 },
      );
      newRun = response.data;
    } catch (error) {
      toast.error('Failed to send prompt.');
      return;
    }
    setProcessingRuns((runs) => [...runs, newRun]);
  };
  return (
    <div>
      <UserInput onSend={(message) => sendPrompt(message)} />
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 justify-items-center">
        {processingRuns.map((run, idx) => (
          <RunPreview
            key={idx}
            runId={run._id}
            jobStatus={run.jobStatus as JobStatusType}
            prompt={run.prompt}
            createdAt={new Date(run.createdAt)}
          />
        ))}
      </div>
      <RecentRuns />
    </div>
  );
};
export default Page;
