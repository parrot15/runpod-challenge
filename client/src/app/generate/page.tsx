'use client';

import React, { useState } from 'react';

const Page = () => {
  const [prompt, setPrompt] = useState('');

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
      console.log(`Run:\n${JSON.stringify(newRun)}`);

      checkStatus(newRun._id);
    } catch (error) {
      console.error('Failed to send prompt:', error);
    }
  }

  // Poll for status of image generation
  const checkStatus = async (runId: string) => {
    try {
      const response = await fetch(`http://localhost:8000/api/runs/${runId}`);
      const runStatus = await response.json();
      console.log(`runStatus:\n${JSON.stringify(runStatus)}`);
      if (runStatus.status === 'COMPLETED') {
        console.log('Image generation completed:', runStatus.output);
        // Stop polling and handle completed run
        // return;
      } else {
        // console.log('Job status:', runStatus.status);
        setTimeout(() => checkStatus(runId), 5000);  // Poll every 5 seconds
      }
    } catch (error) {
      console.error('Failed to check run status:', error);
    }
  };

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
    </div>
  );
};
export default Page;