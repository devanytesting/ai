// import { render, screen, fireEvent } from '@testing-library/react';
// import { SignUpForm } from './SignUpForm';
//
// jest.mock('@/hooks/redux', () => ({
//   useAppDispatch: () => jest.fn(),
// }));
// jest.mock('sonner', () => ({ toast: { success: jest.fn(), error: jest.fn() } }));
//
// describe('SignUpForm', () => {
//   it('renders and allows typing into fields', () => {
//     render(<SignUpForm onToggleMode={() => {}} />);
//
//     fireEvent.change(screen.getByLabelText(/full name/i), { target: { value: 'John Doe' } });
//     fireEvent.change(screen.getByLabelText(/^email$/i), { target: { value: 'john@example.com' } });
//     fireEvent.change(screen.getByLabelText(/^password$/i), { target: { value: 'secret' } });
//
//     fireEvent.click(screen.getByRole('button', { name: /create account/i }));
//
//     expect(screen.getByText(/join our recruitment platform/i)).toBeInTheDocument();
//   });
// });

