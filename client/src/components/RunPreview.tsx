'use client';

import React, {useEffect, useState, useCallback} from 'react';
import Image from 'next/image';
import { toast } from 'react-toastify';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';
import api from '@/config/api';
import RunModal from './RunModal';
import { JobStatusType, JOB_STATUS_MESSAGES } from '@/constants/constants';
import axios, { AxiosError } from 'axios';

interface RunPreviewProps {
  runId: string,
  imageUuid?: string,
  jobStatus: JobStatusType,
  prompt: string,
  createdAt: Date,
};

const RunPreview = ({runId, imageUuid = '', jobStatus, prompt, createdAt}: RunPreviewProps) => {
  const [uuid, setUuid] = useState(imageUuid);
  const [status, setStatus] = useState<JobStatusType>(jobStatus);
  const [isHovered, setHovered] = useState(false);
  const [isModalOpen, setModalOpen] = useState(false);

  const pollStatus = useCallback(async () => {
    let shouldPoll = true;
    try {
      // Potentially lots of concurrent polling, so requests
      // should time out after 2 secs
      const response = await api.get(`/runs/${runId}`, { timeout: 2000 });
      const runState = response.data;
      setStatus(runState.jobStatus);
      if (runState.jobStatus === JobStatusType.Completed) {
        // Stop polling and handle completed run
        setUuid(runState.imageUuid);
        shouldPoll = false;
      }
    } catch (error: AxiosError | any) {
      if (axios.isCancel(error)) {
        // If request was canceled, handle it silently
      } else if (error.code === 'ECONNABORTED') {
        // If request timed out, handle it silently
      } else {
        toast.error('Failed to poll status.');
        shouldPoll = false;
      }
    } finally {
      if (shouldPoll) {
        setTimeout(() => pollStatus(), 5000);  // Poll every 5 seconds
      }
    }
  }, [runId]);

  useEffect(() => {
    if (!imageUuid) {
      pollStatus();
    }
  }, [imageUuid, pollStatus]);

  if (status !== JobStatusType.Completed) {
    // Status indicator
    return (
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
        className="m-2 shadow-lg rounded-lg overflow-hidden flex aspect-square w-64 h-64 relative cursor-pointer"
      >
        <Image
          src={`http://localhost:8000/static/images/${uuid}.png`}
          alt='Generated image'
          width={256}
          height={256}
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