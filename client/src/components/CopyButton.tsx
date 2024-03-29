'use client';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCopy, faCheck } from '@fortawesome/free-solid-svg-icons';
import { useState } from 'react';

interface CopyButtonProps {
  prompt: string;
}

/**
 * A button that copies a given text to the clipboard. When clicked,
 * changes appearance to indicate that text was successfully copied.
 */
const CopyButton = ({ prompt }: CopyButtonProps) => {
  const [isCopied, setCopied] = useState(false);

  const copyPromptToClipboard = async () => {
    await navigator.clipboard.writeText(prompt);
  };

  const handleCopy = async () => {
    await copyPromptToClipboard();
    setCopied(true);
    setTimeout(() => setCopied(false), 2000); // Reset after 2 secs
  };

  return (
    <button
      onClick={handleCopy}
      className={`inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white ${isCopied ? 'bg-green-500' : 'bg-purple-700 hover:opacity-90'}`}
    >
      <FontAwesomeIcon icon={isCopied ? faCheck : faCopy} className="mr-2" />
      {isCopied ? 'Copied' : 'Copy prompt'}
    </button>
  );
};
export default CopyButton;
