import { render, screen } from '@testing-library/react';
import { DeleteJobPostModal } from './DeleteJobPostModal';

jest.mock('@/hooks/redux', () => ({ useAppDispatch: () => jest.fn() }));

jest.mock('sonner', () => ({ toast: { success: jest.fn(), error: jest.fn() } }));

describe('DeleteJobPostModal', () => {
  it('renders confirmation text with title', () => {
    render(
      <DeleteJobPostModal isOpen={true} onClose={() => {}} jobPost={{ id: 1, title: 'JP', requisition_id: 1, description: '', location: '', experience_required: 0, skills_required: [], salary_range_min: 0, salary_range_max: 0, employment_type: '', status: 'draft', published_portals: [], external_job_ids: {}, created_by: 1, created_at: '', published_at: '', expires_at: '' }} />
    );

    expect(screen.getByText(/Delete Job Post/i)).toBeInTheDocument();
    expect(screen.getByText(/JP/)).toBeInTheDocument();
  });
});

