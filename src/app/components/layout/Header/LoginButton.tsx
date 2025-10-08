'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { isAuthenticated, logout } from '@/utils/auth';

const LoginButton = () => {
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    setIsLoggedIn(isAuthenticated());
  }, []);

  const handleClick = () => {
    if (isLoggedIn) {
      // 可以選擇導向個人頁面或直接登出
      // router.push('/profile');
      logout();
    } else {
      router.push('/login');
    }
  };

  return (
    <button
      onClick={handleClick}
      className='flex items-center gap-2 rounded-md border border-gray-200 px-4 py-2 hover:bg-gray-50 transition-colors'
    >
      {isLoggedIn ? <span>登出</span> : <span>登入</span>}
    </button>
  );
};

export default LoginButton;
