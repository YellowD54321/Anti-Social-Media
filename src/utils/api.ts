import axios, { AxiosError } from 'axios';

/**
 * API utility functions for the application
 */

// API Base URL - 可透過環境變數設定
const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || 'http://127.0.0.1:3000';

export interface QuitItTodayResponse {
  success: boolean;
  message: string;
  timestamp?: string;
  error?: string;
}

export interface QuitItTodayRequest {
  userId: string;
  socialMediaType: string;
}

/**
 * 呼叫 postQuitItToday API
 * @returns Promise<QuitItTodayResponse>
 */
export async function postQuitItToday(): Promise<QuitItTodayResponse> {
  try {
    // 現階段使用固定值
    const requestData: QuitItTodayRequest = {
      userId: 'test0001',
      socialMediaType: 'Facebook',
    };

    const response = await axios.post<QuitItTodayResponse>(
      `${API_BASE_URL}/quitItToday`,
      requestData,
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
