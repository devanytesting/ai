import { render, screen, fireEvent } from '@testing-library/react';
import { SignInForm } from './SignInForm';

jest.mock('@/hooks/redux', () => ({
  useAppDispatch: () => jest.fn(),
}));

jest.mock('sonner', () => ({ toast: { success: jest.fn(), error: jest.fn() } }));

describe('SignInForm', () => {
  it('renders and submits the form', () => {
    render(<SignInForm onToggleMode={() => {}} />);

    fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'test@example.com' } });
    fireEvent.change(screen.getByLabelText(/password/i), { target: { value: 'secret' } });
    fireEvent.click(screen.getByRole('button', { name: /sign in/i }));

    expect(screen.getByText(/access your recruitment dashboard/i)).toBeInTheDocument();
  });
});
