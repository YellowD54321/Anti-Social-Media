import { render, screen, fireEvent } from '@testing-library/react';
import GoogleLoginButton from '../GoogleLoginButton';
import { signIn } from 'next-auth/react';
import '@testing-library/jest-dom';

// Mock next-auth
jest.mock('next-auth/react', () => ({
  signIn: jest.fn(),
}));

// Mock next/image
jest.mock('next/image', () => ({
  __esModule: true,
  default: (props: any) => <img {...props} />,
}));

describe('GoogleLoginButton', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders Google login button with correct text and image', () => {
    render(<GoogleLoginButton />);

    const button = screen.getByRole('button');
    expect(button).toBeInTheDocument();
    expect(button).toHaveTextContent('Sign in with Gooooogle');

    const image = screen.getByAltText('Google logo');
    expect(image).toBeInTheDocument();
    expect(image).toHaveAttribute('src', '/google-logo.svg');
  });

  it('calls signIn with correct parameters when clicked', () => {
    render(<GoogleLoginButton />);

    const button = screen.getByRole('button');
    fireEvent.click(button);

    expect(signIn).toHaveBeenCalledTimes(1);
    expect(signIn).toHaveBeenCalledWith('google', {
      callbackUrl: '/',
      redirect: true,
    });
  });
});
