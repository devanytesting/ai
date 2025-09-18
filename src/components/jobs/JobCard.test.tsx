// import { render, screen, fireEvent } from '@testing-library/react';
// import { JobCard } from './JobCard';
// import type { Job } from '@/features/jobs/jobsSlice';
//
// describe('JobCard', () => {
//   const job: Job = {
//     id: '1',
//     title: 'Frontend Dev',
//     description: 'Build UI',
//     experience: 2,
//     location: 'Remote',
//     skills: ['React', 'TS'],
//   };
//
//   it('renders job info and triggers handlers', () => {
//     const onViewDetails = jest.fn();
//     const onUploadResumes = jest.fn();
//     const onViewMatched = jest.fn();
//     const onPostToSocial = jest.fn();
//     const onEditJob = jest.fn();
//     const onDeleteJob = jest.fn();
//     const onCreateJobPost = jest.fn();
//
//     render(
//       <JobCard
//         job={job}
//         onViewDetails={onViewDetails}
//         onUploadResumes={onUploadResumes}
//         onViewMatched={onViewMatched}
//         onPostToSocial={onPostToSocial}
//         onEditJob={onEditJob}
//         onDeleteJob={onDeleteJob}
//         onCreateJobPost={onCreateJobPost}
//       />
//     );
//
//     expect(screen.getByText('Frontend Dev')).toBeInTheDocument();
//     fireEvent.click(screen.getByText(/View/i));
//     expect(onViewDetails).toHaveBeenCalledWith(job);
//   });
// });
