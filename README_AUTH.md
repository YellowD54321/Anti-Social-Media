# 登入系統說明

## 📋 已完成的功能

✅ Google OAuth 登入（方案二：完全自行處理）  
✅ 登出功能  
✅ 後端 API 整合（自動帶 cookie）  
✅ 401 錯誤自動處理  
✅ 簡單清晰的程式碼結構

## 🚀 快速開始

### 1. 設定環境變數

建立 `.env.local` 檔案：

```env
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_BACKEND_API_URL=https://your-lambda-api-url.com
```

詳細設定請看：[SETUP.md](./SETUP.md)

### 2. 取得 Google OAuth 憑證

1. 到 [Google Cloud Console](https://console.cloud.google.com/)
2. 建立專案
3. 啟用 Google+ API
4. 建立 OAuth 憑證
5. 設定 redirect URI：`http://localhost:3000/api/auth/google/callback`

### 3. 啟動開發伺服器

```bash
npm run dev
```

訪問 `http://localhost:3000/login` 測試登入

## 📁 檔案結構

```
src/
├── app/
│   ├── api/
│   │   └── auth/
│   │       ├── google/callback/route.ts  # Google OAuth 回調
│   │       └── logout/route.ts           # 登出 API
│   └── login/
│       ├── page.tsx                      # 登入頁面
│       └── components/
│           └── GoogleLoginButton.tsx     # Google 登入按鈕
│
└── utils/
    ├── api.ts                            # API 呼叫工具
    └── auth.ts                           # 認證工具函數
```

## 🔄 登入流程

```
1. 使用者點擊「Google 登入」
   ↓
2. 跳轉到 Google 登入頁面
   ↓
3. 使用者授權
   ↓
4. Google 重定向回 /api/auth/google/callback
   ↓
5. Next.js 用 code 換取 access token
   ↓
6. 取得使用者資料
   ↓
7. 發送到您的後端 API
   ↓
8. 後端返回 auth token
   ↓
9. 存入 cookie
   ↓
10. 重定向到首頁（完成）
```

## 💻 使用範例

### 前端呼叫後端 API

```typescript
import { callBackendApi } from '@/utils/api';

// 自動帶上 auth_token cookie
const data = await callBackendApi('/api/user/profile');
```

### 登出

```typescript
import { logout } from '@/utils/auth';

await logout(); // 會清除 cookie 並跳轉到 /login
```

### 檢查登入狀態

```typescript
import { isAuthenticated } from '@/utils/auth';

if (isAuthenticated()) {
  // 使用者已登入
}
```

詳細範例請看：[API_USAGE.md](./API_USAGE.md)

## 🔧 後端需要實作

### 端點：`POST /auth/google`

**Request:**

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

### Token 驗證

後端需要：

1. 從 cookie 提取 `auth_token`
2. 驗證 token
3. 返回資料或 401 錯誤

### CORS 設定

```javascript
headers: {
  'Access-Control-Allow-Origin': process.env.FRONTEND_URL,
  'Access-Control-Allow-Credentials': 'true',
}
```

## 📚 相關文件

- [SETUP.md](./SETUP.md) - 環境設定詳細說明
- [API_USAGE.md](./API_USAGE.md) - API 使用範例

## 🔑 關鍵特點

### 簡單

- 不使用 NextAuth（少一層複雜度）
- 直接控制整個 OAuth 流程
- 程式碼清晰易懂

### 安全

- Cookie 使用 `httpOnly`（防 XSS）
- Production 使用 `secure`（HTTPS only）
- CORS 正確設定

### 自動化

- Cookie 自動傳送
- 401 自動處理（清除 cookie + 跳轉登入頁）
- 錯誤自動處理

## ⚠️ 注意事項

1. `.env.local` 不要提交到 git
2. Google OAuth redirect URI 必須完全一致
3. 開發用 `http://localhost:3000`（不要用 127.0.0.1）
4. 正式環境必須用 HTTPS
5. 後端 CORS 不要用 `*`，要指定正確的 origin
