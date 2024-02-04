'use client';

import React, { useState, useEffect } from 'react';
import RunPreview from '@/components/RunPreview';
import UserInput from '@/components/UserInput';
import RecentGenerations from '@/components/RecentGenerations';
import { RunProps } from '@/types/types';
import { JobStatusType } from '@/constants/constants';

const Page = () => {
  const [processingRuns, setProcessingRuns] = useState<RunProps[]>([]);

  useEffect(() => {
    loadProcessingRuns();
  }, []);

  const loadProcessingRuns = async () => {
    const response = await fetch('http://localhost:8000/api/runs?state=processing&order=recent');
    const runData = await response.json();
    setProcessingRuns(runData);
  };

  const sendPrompt = async (prompt: string) => {
    if (!prompt) {
      return;
    }

    try {
      const response = await fetch('http://localhost:8000/api/runs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({prompt: prompt})
      });
      const newRun = await response.json();
      console.log('Run:', JSON.stringify(newRun));
      setProcessingRuns(runs => [...runs, newRun]);
    } catch (error) {
      console.error('Failed to send prompt:', error);
    }
  }
  return (
    <div>
      <UserInput
        onSend={(message) => sendPrompt(message)}
      />
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
      <RecentGenerations />
    </div>
  );
};
export default Page;