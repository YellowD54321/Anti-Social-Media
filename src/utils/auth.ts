/**
 * 認證相關工具函數
 */

/**
 * 登出函數
 */
export async function logout() {
  try {
    await fetch('/api/auth/logout', { method: 'POST' });
    window.location.href = '/login';
  } catch (error) {
    console.error('登出失敗:', error);
  }
}

/**
 * 檢查是否已登入（檢查 cookie 是否存在）
 */
export function isAuthenticated(): boolean {
  if (typeof document === 'undefined') return false;

  const cookies = document.cookie.split(';');
  return cookies.some(
    (cookie) =>
      cookie.trim().startsWith('auth_token=') ||
      cookie.trim().startsWith('user=')
  );
}

/**
 * 取得目前登入的使用者資料（僅在開發測試時使用）
 * 正式環境應該從後端 API 取得
 */
export function getCurrentUser() {
  if (typeof document === 'undefined') return null;

  const cookies = document.cookie.split(';');
  const userCookie = cookies.find((cookie) =>
    cookie.trim().startsWith('user=')
  );

  if (!userCookie) return null;

  try {
    const userJson = decodeURIComponent(userCookie.split('=')[1]);
    return JSON.parse(userJson);
  } catch {
    return null;
  }
}
