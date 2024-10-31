import LoginPage from '@/app/login/page';
import { render, screen } from '@testing-library/react';

jest.mock('../components/GoogleLoginButton', () => {
  return function MockGoogleLoginButton() {
    return <div data-testid='google-login-button'>Google Login Button</div>;
  };
});

describe('LoginPage', () => {
  it('renders login page correctly', () => {
    render(<LoginPage />);

    expect(screen.getByTestId('google-login-button')).toBeInTheDocument();
  });
});
