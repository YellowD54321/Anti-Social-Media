'use client';

import { signIn } from 'next-auth/react';
import Image from 'next/image';

const GoogleLoginButton = () => {
  const handleGoogleLogin = () => {
    signIn('google', { callbackUrl: '/', redirect: true });
  };

  return (
    <button
      onClick={handleGoogleLogin}
      className='group relative flex w-full justify-center items-center rounded-md border border-transparent bg-white py-2 px-4 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 shadow-md'
    >
      <Image
        src='/google-logo.svg'
        alt='Google logo'
        width={20}
        height={20}
        className='mr-2'
      />
      Sign in with Gooooogle
    </button>
  );
};

export default GoogleLoginButton;
