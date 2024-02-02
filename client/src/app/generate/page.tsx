'use client';

import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import RunPreview from '@/components/RunPreview';
import { RunProps } from '@/types/types';

const Page = () => {
  const [prompt, setPrompt] = useState('');
  // const timeout = useRef<NodeJS.Timeout | null>(null);
  // const [isLoading, setLoading] = useState(false);
  // const [imageUuids, setImageUuids] = useState<string[]>([]);
  const [processingRuns, setProcessingRuns] = useState<RunProps[]>([]);

  useEffect(() => {
    loadProcessingRuns();
  }, []);

  const loadProcessingRuns = async () => {
    const response = await fetch('http://localhost:8000/api/runs');
    const runData = await response.json();
    setProcessingRuns(runData);
  };

  // Send prompt to start image generation
  const sendPrompt = async (event: React.FormEvent) => {
    event.preventDefault();
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

      // checkStatus(newRun._id);
    } catch (error) {
      console.error('Failed to send prompt:', error);
    }
  }

  // Poll for status of image generation
  // const checkStatus = async (runId: string) => {
  //   try {
  //     const response = await fetch(`http://localhost:8000/api/runs/${runId}`);
  //     const runState = await response.json();
  //     console.log('runState:', JSON.stringify(runState));
  //     if (runState.jobStatus === 'COMPLETED') {
  //       console.log('Image generation completed:', runState.imageUuids);
  //       // Stop polling and handle completed run
  //       // clearTimeout(timeout.current!);
  //       // setLoading(false);
  //       loadImage(runState.imageUuids);
  //     } else {
  //       // console.log('Job status:', runStatus.status);
  //       // timeout.current = setTimeout(() => checkStatus(runId), 5000);  // Poll every 5 seconds
  //       // setLoading(true);
  //       // if (isLoading) {
  //       setTimeout(() => checkStatus(runId), 5000);  // Poll every 5 seconds
  //       // }
  //     }
  //   } catch (error) {
  //     console.error('Failed to check run status:', error);
  //   }
  // };

  // const loadImage = (uuids: string[]) => {
  //   setImageUuids(uuids);
  // }

  return (
    <div>
      <p>Generate page</p>
      <form onSubmit={sendPrompt} className="p-2">
        <input 
          type="text" 
          value={prompt}
          onChange={(event) => setPrompt(event.target.value)}
          className="border-2 border-gray-300 rounded-lg px-2 w-10/12"
        />
        <button type="submit" disabled={!prompt} className="bg-blue-500 text-white rounded-lg px-4 ml-2">Send</button>
      </form>
      <div>
        {/* {imageUuids.map((uuid, idx) => (
          <ImagePreview
            key={idx}
            imageUuid={uuid}
            // isLoading={isLoading}
          />
          // <Image
          //   key={idx}
          //   src={`http://localhost:8000/static/images/${uuid}.png`}
          //   alt={`Generated image ${idx}`}
          //   width={500}
          //   height={500}
          //   // Tell Next.js to not mess with the URL so we can
          //   // properly load from the server
          //   unoptimized={true}
          // />
        ))} */}
        {processingRuns.map((run, idx) => (
          <RunPreview
            key={idx}
            runId={run._id}
            // imageUuid={run.imageUuids[0]}
          />
        ))}
      </div>
    </div>
  );
};
export default Page;