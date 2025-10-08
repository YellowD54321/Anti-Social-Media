import axios, { AxiosError } from 'axios';

/**
 * API utility functions for the application
 */

// API Base URL - 可透過環境變數設定
const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || 'http://127.0.0.1:3000';

// Lambda 後端 API URL
const BACKEND_API_URL = process.env.NEXT_PUBLIC_BACKEND_API_URL || '';

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

/**
 * 呼叫後端 API（會自動帶上 auth_token cookie）
 */
interface ApiCallOptions {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  data?: any;
  headers?: Record<string, string>;
}

export async function callBackendApi<T = any>(
  endpoint: string,
  options: ApiCallOptions = {}
): Promise<T> {
  const { method = 'GET', data, headers = {} } = options;

  try {
    const response = await axios({
      url: `${BACKEND_API_URL}${endpoint}`,
      method,
      data,
      headers: {
        'Content-Type': 'application/json',
        ...headers,
      },
      withCredentials: true, // 自動帶上 cookie
    });

    return response.data;
  } catch (error) {
    console.error(`Error calling backend API (${endpoint}):`, error);

    if (axios.isAxiosError(error)) {
      const axiosError = error as AxiosError<{ message?: string }>;

      // 如果是 401 未授權，清除 cookie 並跳轉到登入頁
      if (axiosError.response?.status === 401) {
        document.cookie =
          'auth_token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
        window.location.href = '/login';
      }

      throw new Error(
        axiosError.response?.data?.message ||
          axiosError.message ||
          '後端 API 呼叫失敗'
      );
    }

    throw error;
  }
}
