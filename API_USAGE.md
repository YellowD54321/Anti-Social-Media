# API 使用範例

## 前端呼叫後端 API

### 1. 基本用法

```typescript
import { callBackendApi } from '@/utils/api';

// GET 請求
const profile = await callBackendApi('/api/user/profile');

// POST 請求
const result = await callBackendApi('/api/user/update', {
  method: 'POST',
  data: { name: 'New Name' },
});

// PUT 請求
await callBackendApi('/api/settings', {
  method: 'PUT',
  data: { theme: 'dark' },
});

// DELETE 請求
await callBackendApi('/api/item/123', {
  method: 'DELETE',
});
```

### 2. 在 React 組件中使用

```typescript
'use client';

import { useState } from 'react';
import { callBackendApi } from '@/utils/api';

export default function ProfileComponent() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const loadProfile = async () => {
    setLoading(true);
    setError(null);

    try {
      const data = await callBackendApi('/api/user/profile');
      setProfile(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <button onClick={loadProfile}>載入個人資料</button>
      {loading && <p>載入中...</p>}
      {error && <p>錯誤: {error}</p>}
      {profile && <pre>{JSON.stringify(profile, null, 2)}</pre>}
    </div>
  );
}
```

### 3. 錯誤處理

```typescript
import { callBackendApi } from '@/utils/api';

async function safeApiCall() {
  try {
    const data = await callBackendApi('/api/protected-route');
    return { success: true, data };
  } catch (error) {
    // 401 錯誤會自動重定向到 /login
    // 其他錯誤會拋出
    console.error('API 呼叫失敗:', error);
    return { success: false, error: error.message };
  }
}
```

## 認證相關

### 1. 檢查登入狀態

```typescript
import { isAuthenticated } from '@/utils/auth';

if (isAuthenticated()) {
  console.log('使用者已登入');
} else {
  console.log('使用者未登入');
}
```

### 2. 登出

```typescript
import { logout } from '@/utils/auth';

// 會清除 cookie 並重定向到 /login
await logout();
```

### 3. 取得目前使用者（開發測試用）

```typescript
import { getCurrentUser } from '@/utils/auth';

const user = getCurrentUser();
console.log(user); // { email, name, picture, id }
```

## 自動功能

### Cookie 自動處理

- ✅ `callBackendApi()` 會自動帶上 `auth_token` cookie
- ✅ 不需要手動設定 Authorization header
- ✅ 瀏覽器會自動管理 cookie

### 401 自動處理

- ✅ 收到 401 錯誤時會自動清除 cookie
- ✅ 自動重定向到 `/login` 頁面
- ✅ 不需要手動處理未授權狀態

## 後端範例（Node.js + Lambda）

### 從 Cookie 取得 Token

```javascript
// Lambda handler
exports.handler = async (event) => {
  // 從 cookie header 提取 auth_token
  const cookies = event.headers?.cookie?.split(';').reduce((acc, cookie) => {
    const [key, value] = cookie.trim().split('=');
    acc[key] = value;
    return acc;
  }, {});

  const token = cookies?.auth_token;

  if (!token) {
    return {
      statusCode: 401,
      body: JSON.stringify({ message: '未授權' }),
    };
  }

  // 驗證 token（用您的 JWT 庫或其他方式）
  const user = verifyToken(token);

  if (!user) {
    return {
      statusCode: 401,
      body: JSON.stringify({ message: 'Token 無效' }),
    };
  }

  // 返回資料
  return {
    statusCode: 200,
    body: JSON.stringify({ user }),
    headers: {
      'Access-Control-Allow-Credentials': 'true',
      'Access-Control-Allow-Origin': process.env.FRONTEND_URL,
    },
  };
};
```

### CORS 設定

```javascript
// 所有 response 都要包含這些 headers
const corsHeaders = {
  'Access-Control-Allow-Origin': process.env.FRONTEND_URL, // 不要用 '*'
  'Access-Control-Allow-Credentials': 'true',
  'Access-Control-Allow-Methods': 'GET,POST,PUT,DELETE,OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

// 處理 OPTIONS preflight
if (event.httpMethod === 'OPTIONS') {
  return {
    statusCode: 200,
    headers: corsHeaders,
    body: '',
  };
}
```
