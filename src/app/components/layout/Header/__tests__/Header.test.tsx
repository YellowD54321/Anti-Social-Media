import { screen } from '@testing-library/react';
import Header from '../Header';
import { render } from '@/utils/testing/testUtils';

describe('Header', () => {
  it('renders app name link correctly', () => {
    render(<Header />);
    const homeLink = screen.getByRole('link', { name: /my app/i });
    expect(homeLink).toBeInTheDocument();
    expect(homeLink).toHaveAttribute('href', '/');
  });

  it('includes LoginButton component', () => {
    render(<Header />);
    expect(screen.getByRole('button')).toBeInTheDocument();
  });
});
