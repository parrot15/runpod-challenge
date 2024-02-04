'use client';

import React, {useEffect, useState, useCallback} from 'react';
import Image from 'next/image';
// import { Dialog } from '@headlessui/react';
import RunModal from './RunModal';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner, faCopy } from '@fortawesome/free-solid-svg-icons';
import { JobStatusType, JOB_STATUS_MESSAGES } from '@/constants/constants';

interface RunPreviewProps {
  runId: string,
  // shouldCheckStatus: boolean
  imageUuid?: string,
  jobStatus: JobStatusType,
  prompt: string,
  createdAt: Date,
  // onClick: () => void
};

const RunPreview = ({runId, imageUuid = '', jobStatus, prompt, createdAt}: RunPreviewProps) => {
  // const [isLoading, setLoading] = useState(false);
  const [uuid, setUuid] = useState(imageUuid);
  const [status, setStatus] = useState<JobStatusType>(jobStatus);
  const [isHovered, setHovered] = useState(false);
  const [isModalOpen, setModalOpen] = useState(false);

  const pollStatus = useCallback(async () => {
    const response = await fetch(`http://localhost:8000/api/runs/${runId}`);
    const runState = await response.json();
    console.log('runState:', JSON.stringify(runState));
    if (runState.jobStatus === JobStatusType.Completed) {
      // Stop polling and handle completed run
      console.log('Image generation completed:', runState.imageUuid);
      // setLoading(false);
      // setStatus(runState.jobStatus);
      setUuid(runState.imageUuid);
    } else {
      setTimeout(() => pollStatus(), 5000);  // Poll every 5 seconds
      // setLoading(true);
      // setStatus(runState.jobStatus);
    }
    setStatus(runState.jobStatus);
  }, [runId]);

  useEffect(() => {
    if (!imageUuid) {
      pollStatus();
    }
  // }, [imageUuid, pollStatus, loadRun]);
  }, [imageUuid, pollStatus]);

  // const copyPromptToClipboard = async () => {
  //   await navigator.clipboard.writeText(prompt);
  // };

  // if (isLoading || !uuid) {
  if (status !== JobStatusType.Completed) {
    // Status indicator
    console.log(`Inside RunPreview, status: ${status}`);
    return (
      // <div className="animate-pulse bg-gray-300 h-80 w-80 rounded-lg flex items-center justify-center m-2">
      // <div className="m-2 shadow-lg rounded-lg overflow-hidden w-80 h-80 flex items-center justify-center bg-gray-300 animate-pulse">
      <div className="m-2 shadow-lg rounded-lg overflow-hidden flex items-center justify-center aspect-square w-64 h-64 bg-gradient-to-r from-gray-200 to-gray-400 animate-pulse">
        <FontAwesomeIcon icon={faSpinner} className='mr-2 animate-spin' />
        {JOB_STATUS_MESSAGES[status] || 'Loading...'}
      </div>
    );
  }

  return (
    <>
      <div
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        onClick={() => setModalOpen(true)}
        // onClick={() => onClick()}
        className="m-2 shadow-lg rounded-lg overflow-hidden flex aspect-square w-64 h-64 relative cursor-pointer"
      >
        <Image
          src={`http://localhost:8000/static/images/${uuid}.png`}
          alt='Generated image'
          width={256}
          height={256}
          // layout="fill" // Changed to fill to make image responsive
          className="rounded-xl object-cover" // Ensure the image covers the area well
          // Tell Next.js to not mess with the URL so we can
          // properly load from the server
          unoptimized={true}
        />
        {isHovered && (
          <div className="opacity-0 hover:opacity-100 duration-300 absolute inset-0 bg-black bg-opacity-50 flex items-end justify-center text-white p-4">
            {prompt}
          </div>
        )}
      </div>
      {status === JobStatusType.Completed && <RunModal
        imageUuid={uuid}
        prompt={prompt}
        createdAt={createdAt}
        isOpen={isModalOpen}
        onClose={() => setModalOpen(false)}
      />}
    </>
  );
};
export default RunPreview;