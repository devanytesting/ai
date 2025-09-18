import { render, screen } from '@testing-library/react';
import { DeleteJobModal } from './DeleteJobModal';

jest.mock('@/hooks/redux', () => ({ useAppDispatch: () => jest.fn() }));

describe('DeleteJobModal', () => {
  it('shows job info in confirmation', () => {
    render(
      <DeleteJobModal isOpen={true} onClose={() => {}} job={{ id: '1', title: 'T', experience: 0, location: '', skills: [] }} />
    );

    expect(screen.getByText('T')).toBeInTheDocument();
  });
});

