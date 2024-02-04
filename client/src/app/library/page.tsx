'use client';

import React, {useState, useEffect} from 'react';
import RunPreview from '@/components/RunPreview';
import { RunProps } from '@/types/types';
import { JobStatusType } from '@/constants/constants';

const Page = () => {
  const [completedRuns, setCompletedRuns] = useState<RunProps[]>([]);
  // const [isLoading, setLoading] = useState(false);

  useEffect(() => {
    loadCompletedRuns();
  }, []);

  const loadCompletedRuns = async () => {
    // setLoading(true);
    const response = await fetch('http://localhost:8000/api/runs?completed&order=recent');
    const runData = await response.json();
    setCompletedRuns(runData);
    // setLoading(false);
  };

  // if (isLoading) {
  //   return <p>Loading...</p>;
  // }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 justify-items-center">
      {completedRuns.map((run, idx) => (
        <RunPreview
          key={idx}
          runId={run._id}
          // shouldCheckStatus={false}
          imageUuid={run.imageUuid}
          jobStatus={run.jobStatus as JobStatusType}
          prompt={run.prompt}
          createdAt={new Date(run.createdAt)}
          // onClick={() => {}}
        />
      ))}
    </div>
  );
};
export default Page;