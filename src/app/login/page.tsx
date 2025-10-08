import GoogleLoginButton from '@/app/login/components/GoogleLoginButton';
import Header from '@/app/components/layout/Header/Header';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Login',
  description: 'Login to your account with Google',
};

export default function LoginPage() {
  return (
    <div className='min-h-screen flex flex-col'>
      <div className='flex-1 flex flex-col items-center justify-center p-8'>
        <main className='flex flex-col items-center gap-12 text-center'>
          <div className='space-y-4'>
            <h1 className='text-4xl md:text-6xl font-bold text-foreground'>
              登入 / 註冊
            </h1>
            <p className='text-lg md:text-xl text-gray-600 dark:text-gray-400 max-w-2xl'>
              使用 Google 帳號登入以開始使用
            </p>
          </div>

          <GoogleLoginButton />
        </main>
      </div>
    </div>
  );
}
