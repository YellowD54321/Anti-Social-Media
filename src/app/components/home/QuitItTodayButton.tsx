'use client';

import { useState } from 'react';
import { postQuitItToday } from '@/utils/api';

export default function QuitItTodayButton() {
  const [isQuit, setIsQuit] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleQuit = async () => {
    setIsLoading(true);

    try {
      // 立即更新 UI 狀態，不管 API 結果如何
      setIsQuit(true);

      // 呼叫 API
      const result = await postQuitItToday();

      // 可以在這裡處理 API 結果，例如顯示成功或錯誤訊息
      console.log('API Result:', result);
    } catch (error) {
      console.error('Error in handleQuit:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button
      onClick={handleQuit}
      disabled={isQuit || isLoading}
      className={`
        px-8 py-4 rounded-full font-semibold text-lg transition-all duration-300 transform
        ${
          isQuit
            ? 'bg-gray-300 text-gray-500 cursor-not-allowed opacity-60'
            : isLoading
            ? 'bg-gradient-to-r from-orange-400 to-yellow-400 text-white cursor-wait'
            : 'bg-gradient-to-r from-red-500 to-pink-500 text-white hover:from-red-600 hover:to-pink-600 hover:scale-105 hover:shadow-lg active:scale-95'
        }
        border-2 border-transparent
        ${!isQuit && !isLoading && 'hover:border-red-300'}
        focus:outline-none focus:ring-4 focus:ring-red-200
        disabled:transform-none disabled:hover:scale-100 disabled:hover:shadow-none
      `}
    >
      {isLoading
        ? 'Processing... ⏳'
        : isQuit
        ? 'I Already Quit It Today! 🎉'
        : 'I Quit It Today!!'}
    </button>
  );
}
