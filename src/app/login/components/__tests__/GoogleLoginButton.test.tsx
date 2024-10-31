import { render, screen, fireEvent } from '@testing-library/react';
import GoogleLoginButton from '../GoogleLoginButton';
import { signIn } from 'next-auth/react';

// Mock next-auth
jest.mock('next-auth/react', () => ({
  signIn: jest.fn(),
}));

// Mock next/image
jest.mock('next/image', () => ({
  __esModule: true,
  // eslint-disable-next-line jsx-a11y/alt-text, @next/next/no-img-element
  default: (props: React.ComponentProps<'img'>) => <img {...props} />,
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
