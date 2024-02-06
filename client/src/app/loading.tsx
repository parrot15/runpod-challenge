import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';

/**
 * Loading spinner while page for processing runs is loading.
 */
const Loading = () => {
  return (
    <div className="flex justify-center items-center h-screen">
      <FontAwesomeIcon
        icon={faSpinner}
        className="animate-spin text-gray-300 text-4xl"
      />
    </div>
  );
};
export default Loading;
