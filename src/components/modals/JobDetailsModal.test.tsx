import { render, screen } from '@testing-library/react';
import { JobDetailsModal } from './JobDetailsModal';

describe('JobDetailsModal', () => {
  it('does not render when job is null', () => {
    const { container } = render(<JobDetailsModal job={null} isOpen={true} onClose={() => {}} />);
    expect(container.firstChild).toBeNull();
  });

  it('shows job details when job provided', () => {
    render(
      <JobDetailsModal job={{ id: '1', title: 'Title', experience: 1, location: 'Loc', skills: [], description: 'D' }} isOpen={true} onClose={() => {}} />
    );
    expect(screen.getByText(/Title/)).toBeInTheDocument();
  });
});

