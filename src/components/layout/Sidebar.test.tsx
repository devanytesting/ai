import { render, screen } from '@testing-library/react';
import { Sidebar } from './Sidebar';

jest.mock('@/hooks/redux', () => ({
  useAppSelector: () => ({ isAuthenticated: false, user: null }),
  useAppDispatch: () => jest.fn(),
}));

jest.mock('react-router-dom', () => ({ useNavigate: () => jest.fn() }));

describe('Sidebar', () => {
  it('renders menu labels when not collapsed', () => {
    render(
      <Sidebar isCollapsed={false} onToggle={() => {}} isMobileOpen={false} onMobileClose={() => {}} />
    );

    expect(screen.getByText(/Dashboard/i)).toBeInTheDocument();
    expect(screen.getByText(/Job Posts/i)).toBeInTheDocument();
  });
});

