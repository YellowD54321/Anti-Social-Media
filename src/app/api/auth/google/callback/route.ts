import { NextRequest, NextResponse } from 'next/server';
import { OAuth2Client } from 'google-auth-library';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const code = searchParams.get('code');
  const googleClientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
  const googleClientSecret = process.env.GOOGLE_CLIENT_SECRET;
  const appUrl = process.env.NEXT_PUBLIC_APP_URL;

  if (!code) {
    return NextResponse.redirect(new URL('/login?error=no_code', request.url));
  }

  try {
    // 初始化 OAuth2Client
    const client = new OAuth2Client(
      googleClientId,
      googleClientSecret,
      `${appUrl}/api/auth/google/callback`
    );

    // 1. 用 authorization code 換取 tokens
    const { tokens } = await client.getToken(code);

    if (!tokens.id_token) {
      throw new Error('No ID token received from Google');
    }

    // 2. 驗證 ID token 並取得使用者資料（更安全的方式）
    const ticket = await client.verifyIdToken({
      idToken: tokens.id_token,
      audience: googleClientId,
    });

    const payload = ticket.getPayload();

    if (!payload) {
      throw new Error('Failed to get user info from ID token');
    }

    // 組裝使用者資料
    const googleUser = {
      id: payload.sub,
      email: payload.email,
      name: payload.name,
      picture: payload.picture,
    };

    console.log('✅ Google 認證成功，使用者資料:', googleUser);

    // TODO: call backend api to authenticate user

    return NextResponse.redirect(new URL('/', request.url));
  } catch (error) {
    console.error('OAuth callback error:', error);
    return NextResponse.redirect(
      new URL('/login?error=auth_failed', request.url)
    );
  }
}
