'use client';

import React, {useState, useEffect} from 'react';
import RunPreview from '@/components/RunPreview';
import { RunProps } from '@/types/types';

const Page = () => {
  const [completedRuns, setCompletedRuns] = useState<RunProps[]>([]);

  useEffect(() => {
    loadCompletedRuns();
  }, []);

  const loadCompletedRuns = async () => {
    const response = await fetch('http://localhost:8000/api/runs/completed');
    const runData = await response.json();
    setCompletedRuns(runData);
  };

  return (
    <div>
      <p>Library page</p>
      <div>
        {completedRuns.map((run, idx) => (
          <RunPreview
            key={idx}
            runId={run._id}
            // shouldCheckStatus={false}
            imageUuid={run.imageUuid}
          />
        ))}
      </div>
    </div>
  );
};
export default Page;