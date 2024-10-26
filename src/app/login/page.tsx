import GoogleLoginButton from '@/app/login/components/GoogleLoginButton';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Login',
  description: 'Login to your account with Google',
};

export default function LoginPage() {
  return (
    <div className='flex min-h-screen items-center justify-center'>
      <div className='w-full max-w-md space-y-8 rounded-lg bg-white p-6 shadow-md'>
        <h1 className='text-center text-3xl font-bold'>Login</h1>
        <div className='mt-8'>
          <GoogleLoginButton />
        </div>
      </div>
    </div>
  );
}
