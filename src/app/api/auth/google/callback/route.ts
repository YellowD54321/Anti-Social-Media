import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const code = searchParams.get('code');

  if (!code) {
    return NextResponse.redirect(new URL('/login?error=no_code', request.url));
  }

  try {
    // 1. 用 authorization code 向 Google 換取 access token
    const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        code,
        client_id: process.env.GOOGLE_CLIENT_ID,
        client_secret: process.env.GOOGLE_CLIENT_SECRET,
        redirect_uri: `${process.env.NEXT_PUBLIC_APP_URL}/api/auth/google/callback`,
        grant_type: 'authorization_code',
      }),
    });

    if (!tokenResponse.ok) {
      throw new Error('Failed to get tokens from Google');
    }

    const tokens = await tokenResponse.json();

    // 2. 用 access token 取得使用者資料
    const userResponse = await fetch(
      'https://www.googleapis.com/oauth2/v2/userinfo',
      {
        headers: { Authorization: `Bearer ${tokens.access_token}` },
      }
    );

    if (!userResponse.ok) {
      throw new Error('Failed to get user info from Google');
    }

    const googleUser = await userResponse.json();

    // 3. 發送到您的後端 API 進行登入/註冊
    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_API_URL;

    if (backendUrl) {
      const backendResponse = await fetch(`${backendUrl}/auth/google`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: googleUser.email,
          name: googleUser.name,
          picture: googleUser.picture,
          googleId: googleUser.id,
        }),
      });

      if (!backendResponse.ok) {
        throw new Error('Backend authentication failed');
      }

      const backendData = await backendResponse.json();

      // 4. 設定 cookie 儲存 token
      const response = NextResponse.redirect(new URL('/', request.url));

      response.cookies.set('auth_token', backendData.token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 60 * 60 * 24 * 7, // 7 天
        path: '/',
      });

      return response;
    } else {
      // 如果還沒設定後端，暫時將使用者資料存在 cookie（僅供開發測試）
      const response = NextResponse.redirect(new URL('/', request.url));

      response.cookies.set('user', JSON.stringify(googleUser), {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 60 * 60 * 24 * 7,
        path: '/',
      });

      return response;
    }
  } catch (error) {
    console.error('OAuth callback error:', error);
    return NextResponse.redirect(
      new URL('/login?error=auth_failed', request.url)
    );
  }
}
