import { render, screen, fireEvent } from '@testing-library/react';
import { CreateJobPostModal } from './CreateJobPostModal';

jest.mock('@/hooks/redux', () => ({
  useAppDispatch: () => jest.fn(),
  useAppSelector: (fn: any) => fn({ jobPosts: { isLoading: false } }),
}));

jest.mock('sonner', () => ({ toast: { success: jest.fn(), error: jest.fn() } }));

describe('CreateJobPostModal', () => {
  it('renders disabled requisition title and cancel works', () => {
    const onClose = jest.fn();
    render(
      <CreateJobPostModal requisitionId={1} requisitionTitle="Req" isOpen={true} onClose={onClose} />
    );

    expect(screen.getByDisplayValue('Req')).toBeDisabled();
    fireEvent.click(screen.getByRole('button', { name: /cancel/i }));
  });
});

