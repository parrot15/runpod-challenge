'use client';

import React, {useEffect, useState} from 'react';
import Image from 'next/image';

interface RunPreviewProps {
  runId: string,
};

const RunPreview = ({runId}: RunPreviewProps) => {
  const [isLoading, setLoading] = useState(false);
  const [imageUuid, setImageUuid] = useState('');

  useEffect(() => {
    const checkStatus = async () => {
      const response = await fetch(`http://localhost:8000/api/runs/${runId}`);
      const runState = await response.json();
      console.log('runState:', JSON.stringify(runState));
      if (runState.jobStatus === 'COMPLETED') {
        // Stop polling and handle completed run
        console.log('Image generation completed:', runState.imageUuids);
        setLoading(false);
        setImageUuid(runState.imageUuids[0]);
      } else {
        setTimeout(() => checkStatus(), 5000);  // Poll every 5 seconds
        setLoading(true);
      }
    };
    checkStatus();
  }, [runId]);

  if (isLoading || !imageUuid) {
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
      src={`http://localhost:8000/static/images/${imageUuid}.png`}
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