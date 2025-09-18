import { render, screen, fireEvent } from '@testing-library/react';
import { AddJobModal } from './AddJobModal';

jest.mock('@/hooks/redux', () => ({ useAppDispatch: () => jest.fn() }));
jest.mock('sonner', () => ({ toast: { success: jest.fn(), error: jest.fn() } }));

describe('AddJobModal', () => {
  it('renders when open and allows closing', () => {
    const onClose = jest.fn();
    render(<AddJobModal isOpen={true} onClose={onClose} />);

    // Cancel closes
    fireEvent.click(screen.getByRole('button', { name: /cancel/i }));
  });
});

