'use client';

import { useState } from 'react';

export default function QuitItTodayButton() {
  const [isQuit, setIsQuit] = useState(false);

  const handleQuit = () => {
    setIsQuit(true);
  };

  return (
    <button
      onClick={handleQuit}
      disabled={isQuit}
      className={`
        px-8 py-4 rounded-full font-semibold text-lg transition-all duration-300 transform
        ${
          isQuit
            ? 'bg-gray-300 text-gray-500 cursor-not-allowed opacity-60'
            : 'bg-gradient-to-r from-red-500 to-pink-500 text-white hover:from-red-600 hover:to-pink-600 hover:scale-105 hover:shadow-lg active:scale-95'
        }
        border-2 border-transparent
        ${!isQuit && 'hover:border-red-300'}
        focus:outline-none focus:ring-4 focus:ring-red-200
        disabled:transform-none disabled:hover:scale-100 disabled:hover:shadow-none
      `}
    >
      {isQuit ? 'I Already Quit It Today! 🎉' : 'I Quit It Today!!'}
    </button>
  );
}
