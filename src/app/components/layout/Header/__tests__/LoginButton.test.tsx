import { screen, fireEvent } from '@testing-library/react';
import LoginButton from '../LoginButton';
import { render } from '@/utils/testing/testUtils';

jest.mock('next/image', () => ({
  __esModule: true,
  // eslint-disable-next-line jsx-a11y/alt-text, @next/next/no-img-element
  default: (props: React.ComponentProps<'img'>) => <img {...props} />,
}));

describe('LoginButton', () => {
  it('renders login text when user is not authenticated', () => {
    render(<LoginButton />, { session: null });
    expect(screen.getByText('Login')).toBeInTheDocument();
  });

  it('renders user icon when user is authenticated', () => {
    render(<LoginButton />, {
      session: {
        user: { name: 'Test User' },
        expires: new Date().toISOString(),
      },
    });
    const profileImage = screen.getByAltText('Profile');
    expect(profileImage).toBeInTheDocument();
    expect(profileImage).toHaveAttribute(
      'src',
      expect.stringContaining('/user.svg')
    );
  });

  it('navigates to login page when clicked and user is not authenticated', () => {
    const { router } = render(<LoginButton />, { session: null });
    fireEvent.click(screen.getByRole('button'));
    expect(router.push).toHaveBeenCalledWith('/login');
  });

  it('navigates to profile page when clicked and user is authenticated', () => {
    const { router } = render(<LoginButton />, {
      session: {
        user: { name: 'Test User' },
        expires: new Date().toISOString(),
      },
    });
    fireEvent.click(screen.getByRole('button'));
    expect(router.push).toHaveBeenCalledWith('/profile');
  });
});
