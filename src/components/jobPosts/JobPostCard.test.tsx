import { render, screen, fireEvent } from '@testing-library/react';
import { JobPostCard } from './JobPostCard';
import type { JobPost } from '@/features/jobPosts/jobPostsSlice';

describe('JobPostCard', () => {
  const jobPost: JobPost = {
    id: 1,
    requisition_id: 1,
    title: 'Frontend Post',
    description: 'Great role',
    location: 'Remote',
    experience_required: 3,
    skills_required: ['React', 'TS', 'Vite'],
    salary_range_min: 0,
    salary_range_max: 0,
    employment_type: 'Full-time',
    status: 'draft',
    published_portals: [],
    external_job_ids: {},
    created_by: 1,
    created_at: new Date().toISOString(),
    published_at: new Date().toISOString(),
    expires_at: new Date(Date.now() + 86400000).toISOString(),
  };

  it('renders job post and triggers actions', () => {
    const onViewDetails = jest.fn();
    const onEditJobPost = jest.fn();
    const onDeleteJobPost = jest.fn();
    const onPublishJobPost = jest.fn();
    const onRegenerateDescription = jest.fn();

    render(
      <JobPostCard
        jobPost={jobPost}
        onViewDetails={onViewDetails}
        onEditJobPost={onEditJobPost}
        onDeleteJobPost={onDeleteJobPost}
        onPublishJobPost={onPublishJobPost}
        onRegenerateDescription={onRegenerateDescription}
      />
    );

    expect(screen.getByText('Frontend Post')).toBeInTheDocument();
    fireEvent.click(screen.getByText(/View/i));
    expect(onViewDetails).toHaveBeenCalledWith(jobPost);
  });
});

