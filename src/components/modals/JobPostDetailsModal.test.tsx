import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { JobPostDetailsModal } from './JobPostDetailsModal';
import { JobPost } from '../../features/jobPosts/jobPostsSlice';

const mockJobPost: JobPost = {
  id: 1,
  title: 'Frontend Developer',
  description: 'Develop and maintain web applications.',
  status: 'Published',
  created_at: '2023-09-01T12:00:00Z',
  expires_at: '2099-12-31T23:59:59Z',
  experience_required: 3,
  location: 'Remote',
  employment_type: 'Full-time',
  salary_range_min: 60000,
  salary_range_max: 90000,
  requisition_id: 123,
  created_by: 42,
  skills_required: ['React', 'TypeScript'],
  published_portals: ['LinkedIn', 'Indeed'],
  published_at: '2023-09-02T12:00:00Z',
  external_job_ids: [],
};

describe('JobPostDetailsModal', () => {
  it('renders nothing if jobPost is null', () => {
    const { container } = render(
      <JobPostDetailsModal jobPost={null} isOpen={true} onClose={jest.fn()} />
    );
    expect(container.firstChild).toBeNull();
  });

  it('renders job post details', () => {
    render(
      <JobPostDetailsModal jobPost={mockJobPost} isOpen={true} onClose={jest.fn()} />
    );
    expect(screen.getByText(/Frontend Developer/i)).toBeInTheDocument();
    expect(screen.getByText(/Published/i)).toBeInTheDocument();
    expect(screen.getByText(/Remote/i)).toBeInTheDocument();
    expect(screen.getByText(/3\+ years experience/i)).toBeInTheDocument();
    expect(screen.getByText(/Develop and maintain web applications./i)).toBeInTheDocument();
    expect(screen.getByText(/React/i)).toBeInTheDocument();
    expect(screen.getByText(/TypeScript/i)).toBeInTheDocument();
    expect(screen.getByText(/LinkedIn/i)).toBeInTheDocument();
    expect(screen.getByText(/Indeed/i)).toBeInTheDocument();
    expect(screen.getByText(/REQ-123/i)).toBeInTheDocument();
    expect(screen.getByText(/User 42/i)).toBeInTheDocument();
    expect(screen.getByText(/Full-time/i)).toBeInTheDocument();
    expect(screen.getByText(/\$60,000 - \$90,000/i)).toBeInTheDocument();
  });

  it('calls onClose when Close button is clicked', () => {
    const onClose = jest.fn();
    render(
      <JobPostDetailsModal jobPost={mockJobPost} isOpen={true} onClose={onClose} />
    );
    fireEvent.click(screen.getByText(/Close/i));
    expect(onClose).toHaveBeenCalled();
  });

  it('shows Expired badge if job is expired', () => {
    const expiredJob = { ...mockJobPost, expires_at: '2000-01-01T00:00:00Z' };
    render(
      <JobPostDetailsModal jobPost={expiredJob} isOpen={true} onClose={jest.fn()} />
    );
    expect(screen.getByText(/Expired/i)).toBeInTheDocument();
  });

  it('calls onRegenerateDescription when Regenerate with AI is clicked', () => {
    const onRegenerateDescription = jest.fn();
    render(
      <JobPostDetailsModal
        jobPost={mockJobPost}
        isOpen={true}
        onClose={jest.fn()}
        onRegenerateDescription={onRegenerateDescription}
      />
    );
    fireEvent.click(screen.getByText(/Regenerate with AI/i));
    expect(onRegenerateDescription).toHaveBeenCalledWith(mockJobPost);
  });

  it('does not render Published Portals section if none provided', () => {
    const jobWithoutPortals = { ...mockJobPost, published_portals: [] };
    render(
      <JobPostDetailsModal jobPost={jobWithoutPortals} isOpen={true} onClose={jest.fn()} />
    );
    expect(screen.queryByText(/Published Portals/i)).not.toBeInTheDocument();
  });

  it('does not render Publication Details if published_at is missing', () => {
    const jobWithoutPublishedAt = { ...mockJobPost, published_at: undefined };
    render(
      <JobPostDetailsModal jobPost={jobWithoutPublishedAt} isOpen={true} onClose={jest.fn()} />
    );
    expect(screen.queryByText(/Publication Details/i)).not.toBeInTheDocument();
  });
});