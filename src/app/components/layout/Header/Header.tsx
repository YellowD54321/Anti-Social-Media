import LoginButton from './LoginButton';
import Link from 'next/link';

export default function Header() {
  return (
    <header className='flex justify-between items-center px-6 py-4 border-b'>
      <Link
        href='/'
        className='text-xl font-bold hover:text-gray-600 transition-colors'
      >
        My App
      </Link>
      <LoginButton />
    </header>
  );
}
