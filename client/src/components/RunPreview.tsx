'use client';

import React, {useEffect, useState, useCallback} from 'react';
import Image from 'next/image';

interface RunPreviewProps {
  runId: string,
  // shouldCheckStatus: boolean
  imageUuid?: string
};

const RunPreview = ({runId, imageUuid = ''}: RunPreviewProps) => {
  const [isLoading, setLoading] = useState(false);
  const [uuid, setUuid] = useState(imageUuid);

  const pollStatus = useCallback(async () => {
    const response = await fetch(`http://localhost:8000/api/runs/${runId}`);
    const runState = await response.json();
    console.log('runState:', JSON.stringify(runState));
    if (runState.jobStatus === 'COMPLETED') {
      // Stop polling and handle completed run
      console.log('Image generation completed:', runState.imageUuid);
      setLoading(false);
      setUuid(runState.imageUuid);
    } else {
      setTimeout(() => pollStatus(), 5000);  // Poll every 5 seconds
      setLoading(true);
    }
  }, [runId]);

  // const loadRun = useCallback(async () => {
  //   const response = await fetch(`http://localhost:8000/api/runs/${runId}`);
  //   const runData = await response.json();
  //   console.log('runData:', JSON.stringify(runData));
  //   setImageUuid(runData.imageUuid);
  // }, [runId]);

  useEffect(() => {
    if (imageUuid) {
      // loadRun();
    } else {
      pollStatus();
    }
  // }, [imageUuid, pollStatus, loadRun]);
  }, [imageUuid, pollStatus]);

  if (isLoading || !uuid) {
    // Loading indicator
    console.log(`Inside RunPreview, isLoading: ${isLoading}`);
    return (
      <div className="animate-pulse bg-gray-300 h-64 w-64">
        Loading...
      </div>
    );
  }
  
  return (
    <Image
      src={`http://localhost:8000/static/images/${uuid}.png`}
      alt='Generated image'
      width={500}
      height={500}
      // Tell Next.js to not mess with the URL so we can
      // properly load from the server
      unoptimized={true}
    />
  );
};
export default RunPreview;