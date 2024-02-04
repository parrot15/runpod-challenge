import React, {useEffect, useState, Suspense} from 'react';
import { RunProps } from '@/types/types';
import RunPreview from './RunPreview';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';
import { JobStatusType } from '@/constants/constants';

const RecentGenerations = () => {
  const [recentRuns, setRecentRuns] = useState<RunProps[]>([]);
  const [isLoading, setLoading] = useState(false);

  const AMOUNT = 5;

  useEffect(() => {
    loadRecentRuns();
  }, []);

  const loadRecentRuns = async () => {
    setLoading(true);
    const response = await fetch(`http://localhost:8000/api/runs?state=completed&order=recent&amount=${AMOUNT}`);
    const runData = await response.json();
    setRecentRuns(runData);
    setLoading(false);
  };

  // return (
  //   <div className="mt-8">
  //     <h2 className="text-2xl font-bold text-center text-gray-300 mb-4">Recent Image Generations</h2>
  //     <Suspense fallback={
  //       <div className="flex justify-center items-center mt-8 text-gray-300">
  //         <FontAwesomeIcon icon={faSpinner} className='mr-2 animate-spin' />Loading...
  //       </div>
  //     }>
  //       <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 justify-items-center">
  //         {recentRuns.map((run, idx) => (
  //           <RunPreview
  //             key={idx}
  //             runId={run._id}
  //             imageUuid={run.imageUuid}
  //             jobStatus={run.jobStatus as JobStatusType}
  //             prompt={run.prompt}
  //             createdAt={new Date(run.createdAt)}
  //           />
  //         ))}
  //       </div>
  //     </Suspense>
  //   </div>
  // );
  return (
    <div className="mt-8">
      <h2 className="text-2xl font-bold text-center text-gray-300 mb-4">Recent Image Generations</h2>
      {isLoading ? (
        <div className="flex justify-center items-center mt-8">
          <FontAwesomeIcon icon={faSpinner} className='mr-2 animate-spin text-gray-300 text-2xl' />
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 justify-items-center">
          {recentRuns.map((run, idx) => (
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
      )}
    </div>
  );
};
export default RecentGenerations;