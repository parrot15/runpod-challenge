'use client';

import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPaperPlane } from '@fortawesome/free-solid-svg-icons';

interface UserInputProps {
  initialMessage?: string,
  onSend: (message: string) => void,
}

const UserInput = ({ initialMessage = '', onSend }: UserInputProps) => {
  const [message, setMessage] = useState(initialMessage);

  const sendMessage = (event: React.FormEvent) => {
    event.preventDefault();
    if (message) {
      onSend(message);
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    // If user presses Enter, send message
    // Enter + Shift should insert a new line
    if (event.key == 'Enter' && !event.shiftKey) {
      event.preventDefault();
      sendMessage(event as React.FormEvent);
    }
  };

  return (
    <form onSubmit={sendMessage} className="p-2 flex justify-center">
      <textarea 
        value={message}
        onChange={(event) => setMessage(event.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="A cyborg overlooking a vast cyberpunk city, stunning, high-resolution"
        rows={4}
        className="mr-2 p-2 w-2/5 h-24 rounded-lg border-2 border-solid border-slate-700 text-white placeholder-gray-400 bg-gray-600 focus:outline-none focus:border-purple-700 resize-none"
      />
      <button
        type="submit"
        disabled={!message}
        className="bg-purple-700 hover:bg-gradient-to-r hover:from-violet-500 hover:to-fuchsia-500 hover:opacity-90 duration-300 text-white rounded-lg w-20 h-10 cursor-pointer"
      >
        <FontAwesomeIcon icon={faPaperPlane} className='mr-2' />Send
      </button>
    </form>
  );
};

export default UserInput;
