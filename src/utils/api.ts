import axios, { AxiosError } from 'axios';

/**
 * API utility functions for the application
 */

export interface QuitItTodayResponse {
  success: boolean;
  message: string;
  timestamp?: string;
  error?: string;
}

/**
 * 呼叫 postQuitItToday API
 * @returns Promise<QuitItTodayResponse>
 */
export async function postQuitItToday(): Promise<QuitItTodayResponse> {
  try {
    const response = await axios.post<QuitItTodayResponse>(
      '/api/quit-it-today',
      {},
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    return response.data;
  } catch (error) {
    console.error('Error calling postQuitItToday API:', error);

    // 處理 axios 錯誤
    if (axios.isAxiosError(error)) {
      const axiosError = error as AxiosError<{ message?: string }>;
      return {
        success: false,
        message: 'Failed to connect to server',
        error: axiosError.response?.data?.message || axiosError.message,
      };
    }

    return {
      success: false,
      message: 'Failed to connect to server',
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}
