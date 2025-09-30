'use client';

import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import Image from 'next/image';

const LoginButton = () => {
  const router = useRouter();
  const { data: session } = useSession();

  const handleClick = () => {
    if (session) {
      router.push('/profile');
    } else {
      router.push('/login');
    }
  };

  return (
    <button
      onClick={handleClick}
      className='flex items-center gap-2 rounded-md border border-gray-200 px-4 py-2 hover:bg-gray-50 transition-colors'
    >
      {session ? (
        <Image src='/user.svg' alt='Profile' width={20} height={20} />
      ) : (
        <span>Login</span>
      )}
    </button>
  );
};

export default LoginButton;
