# Google OAuth 登入設定指南

## 1. 環境變數設定

在專案根目錄建立 `.env.local` 檔案：

```env
# Google OAuth 設定
GOOGLE_CLIENT_ID=your-google-client-id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your-google-client-secret

# 應用程式 URL（用於 OAuth redirect）
NEXT_PUBLIC_APP_URL=http://localhost:3000

# 後端 API URL（Lambda）- 可選，如果還沒有後端可以先不設定
NEXT_PUBLIC_BACKEND_API_URL=https://your-lambda-api-url.com
```

## 2. 取得 Google OAuth 憑證

### 步驟：

1. 前往 [Google Cloud Console](https://console.cloud.google.com/)

2. 建立或選擇一個專案

3. 啟用 Google+ API：

   - 左側選單 → API 和服務 → 資料庫
   - 搜尋 "Google+ API" 或 "Google People API"
   - 點擊啟用

4. 建立 OAuth 2.0 憑證：

   - 左側選單 → API 和服務 → 憑證
   - 點擊「建立憑證」→ 選擇「OAuth 用戶端 ID」
   - 應用程式類型：選擇「網頁應用程式」
   - 名稱：隨意（例如：Anti-Social Media）

5. 設定授權的重定向 URI：

   ```
   http://localhost:3000/api/auth/google/callback
   ```

   如果要部署到正式環境，也要加上：

   ```
   https://yourdomain.com/api/auth/google/callback
   ```

6. 建立後會得到：
   - Client ID（用戶端 ID）
   - Client Secret（用戶端密鑰）
7. 將這兩個值複製到 `.env.local` 檔案

## 3. 登入流程說明

```
1. 使用者點擊「Google 登入」按鈕
   ↓
2. 跳轉到 Google 登入頁面
   ↓
3. 使用者選擇 Google 帳號並授權
   ↓
4. Google 重定向回 /api/auth/google/callback（帶 code）
   ↓
5. Next.js 用 code 向 Google 換取 access token
   ↓
6. 用 access token 取得使用者資料（email, name, picture）
   ↓
7. 發送到您的後端 API 進行登入/註冊
   ↓
8. 後端返回 auth token
   ↓
9. 將 token 存入 cookie
   ↓
10. 重定向到首頁（登入完成）
```

## 4. 使用方式

### 前端呼叫後端 API：

```typescript
import { callBackendApi } from '@/utils/api';

// 會自動帶上 auth_token cookie
const data = await callBackendApi('/api/user/profile');
```

### 登出：

```typescript
await fetch('/api/auth/logout', { method: 'POST' });
window.location.href = '/login';
```

## 5. 後端需要實作的 API

您的 Lambda 後端需要提供以下端點：

### `POST /auth/google`

接收前端傳來的 Google 使用者資料，進行登入或註冊。

**Request Body:**

```json
{
  "email": "user@example.com",
  "name": "User Name",
  "picture": "https://...",
  "googleId": "123456789"
}
```

**Response:**

```json
{
  "success": true,
  "token": "your-jwt-token",
  "user": {
    "id": "user-id",
    "email": "user@example.com",
    "name": "User Name"
  }
}
```

### 驗證 token

前端之後的請求會在 cookie 中帶上 `auth_token`，後端需要：

1. 從 cookie header 提取 `auth_token`
2. 驗證 token（JWT 或其他方式）
3. 返回資料或 401 錯誤

### CORS 設定

Lambda 需要允許 credentials：

```javascript
headers: {
  'Access-Control-Allow-Origin': process.env.FRONTEND_URL,
  'Access-Control-Allow-Credentials': 'true',
  'Access-Control-Allow-Methods': 'GET,POST,PUT,DELETE,OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
}
```

## 6. 測試

1. 確保環境變數已設定
2. 啟動開發伺服器：`npm run dev`
3. 訪問 `http://localhost:3000/login`
4. 點擊「Google 登入」
5. 完成 Google 授權後應該會重定向回首頁

## 7. 注意事項

- ⚠️ `.env.local` 不要提交到 git（已在 .gitignore 中）
- ⚠️ Google OAuth 的 redirect URI 必須完全一致
- ⚠️ 開發環境用 `http://localhost:3000`，不要用 `127.0.0.1`
- ⚠️ 正式環境必須使用 HTTPS
