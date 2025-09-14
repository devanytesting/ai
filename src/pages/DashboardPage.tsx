import React, { useEffect, useState } from 'react';
import { Plus, Briefcase, Menu, RefreshCw, FileText } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '../hooks/redux';
import { fetchJobs, setSelectedJob, postJobToSocial } from '../features/jobs/jobsSlice';
import { fetchJobPosts, setSelectedJobPost, publishJobPost, regenerateJobDescription } from '../features/jobPosts/jobPostsSlice';
import { Layout } from '../components/layout/Layout';
import { JobCard } from '../components/jobs/JobCard';
import { JobPostCard } from '../components/jobPosts/JobPostCard';
import { Job } from '../features/jobs/jobsSlice';
import { JobPost } from '../features/jobPosts/jobPostsSlice';
import { JobDetailsModal } from '../components/modals/JobDetailsModal';
import { AddJobModal } from '../components/modals/AddJobModal';
import { UpdateJobModal } from '../components/modals/UpdateJobModal';
import { DeleteJobModal } from '../components/modals/DeleteJobModal';
import { CreateJobPostModal } from '../components/modals/CreateJobPostModal';
import { JobPostDetailsModal } from '../components/modals/JobPostDetailsModal';
import { PublishJobPostModal } from '../components/modals/PublishJobPostModal';
import { UpdateJobPostModal } from '../components/modals/UpdateJobPostModal';
import { DeleteJobPostModal } from '../components/modals/DeleteJobPostModal';
import { UploadResumesModal } from '../components/modals/UploadResumesModal';
import { MatchedResumesModal } from '../components/modals/MatchedResumesModal';
import { Button } from '../components/ui/button';
import { useToast } from '../hooks/use-toast';

interface DashboardPageProps {
  onMobileToggle?: () => void;
  isCollapsed?: boolean;
}

export const DashboardPage: React.FC<DashboardPageProps> = ({ onMobileToggle, isCollapsed }) => {
  const dispatch = useAppDispatch();
  const { toast } = useToast();
  const { jobs, selectedJob, isLoading } = useAppSelector((state) => state.jobs);
  const { jobPosts, selectedJobPost, isLoading: jobPostsLoading } = useAppSelector((state) => state.jobPosts);

  // Modal states
  const [isAddJobModalOpen, setIsAddJobModalOpen] = useState(false);
  const [isUpdateJobModalOpen, setIsUpdateJobModalOpen] = useState(false);
  const [isDeleteJobModalOpen, setIsDeleteJobModalOpen] = useState(false);
  const [isJobDetailsModalOpen, setIsJobDetailsModalOpen] = useState(false);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [isMatchedModalOpen, setIsMatchedModalOpen] = useState(false);
  const [isCreateJobPostModalOpen, setIsCreateJobPostModalOpen] = useState(false);
  const [isJobPostDetailsModalOpen, setIsJobPostDetailsModalOpen] = useState(false);
  const [isPublishJobPostModalOpen, setIsPublishJobPostModalOpen] = useState(false);
  const [isUpdateJobPostModalOpen, setIsUpdateJobPostModalOpen] = useState(false);
  const [isDeleteJobPostModalOpen, setIsDeleteJobPostModalOpen] = useState(false);
  const [selectedJobId, setSelectedJobId] = useState<string>('');
  const [jobToEdit, setJobToEdit] = useState<Job | null>(null);
  const [jobToDelete, setJobToDelete] = useState<Job | null>(null);
  const [jobToCreatePost, setJobToCreatePost] = useState<Job | null>(null);
  const [jobPostToPublish, setJobPostToPublish] = useState<JobPost | null>(null);
  const [jobPostToEdit, setJobPostToEdit] = useState<JobPost | null>(null);
  const [jobPostToDelete, setJobPostToDelete] = useState<JobPost | null>(null);

  useEffect(() => {
    dispatch(fetchJobs());
    dispatch(fetchJobPosts({ skip: 0, limit: 100 }));
  }, [dispatch]);

  const handleViewDetails = (job: Job) => {
    dispatch(setSelectedJob(job));
    setIsJobDetailsModalOpen(true);
  };

  const handleUploadResumes = (jobId: string) => {
    setSelectedJobId(jobId);
    setIsUploadModalOpen(true);
  };

  const handleViewMatched = (jobId: string) => {
    setSelectedJobId(jobId);
    setIsMatchedModalOpen(true);
  };

  const handlePostToSocial = async (jobId: string, platform: 'instagram' | 'linkedin') => {
    try {
      await dispatch(postJobToSocial({ jobId, platform }));
      toast({
        title: 'Success',
        description: `Job posted to ${platform} successfully`,
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: `Failed to post job to ${platform}`,
        variant: 'destructive',
      });
    }
  };

  const handleEditJob = (job: Job) => {
    setJobToEdit(job);
    setIsUpdateJobModalOpen(true);
  };

  const handleDeleteJob = (job: Job) => {
    setJobToDelete(job);
    setIsDeleteJobModalOpen(true);
  };

  const handleCreateJobPost = (job: Job) => {
    setJobToCreatePost(job);
    setIsCreateJobPostModalOpen(true);
  };

  const handleViewJobPostDetails = (jobPost: JobPost) => {
    dispatch(setSelectedJobPost(jobPost));
    setIsJobPostDetailsModalOpen(true);
  };

  const handlePublishJobPost = (jobPost: JobPost) => {
    setJobPostToPublish(jobPost);
    setIsPublishJobPostModalOpen(true);
  };

  const handleRegenerateDescription = async (jobPost: JobPost) => {
    try {
      await dispatch(regenerateJobDescription(jobPost.id)).unwrap();
      toast({
        title: 'Success',
        description: 'Job description regenerated successfully!',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to regenerate job description. Please try again.',
        variant: 'destructive',
      });
    }
  };

  const handleEditJobPost = (jobPost: JobPost) => {
    setJobPostToEdit(jobPost);
    setIsUpdateJobPostModalOpen(true);
  };

  const handleDeleteJobPost = (jobPost: JobPost) => {
    setJobPostToDelete(jobPost);
    setIsDeleteJobPostModalOpen(true);
  };

  return (
    <div className="overflow-auto">
      <div className="p-6 lg:p-8">
        <header className="flex items-center justify-between mb-8 pb-4 border-b border-border">
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              size="sm"
              className="lg:hidden"
              onClick={onMobileToggle}
            >
              <Menu className="w-5 h-5" />
            </Button>
              <div>
                <h1 className="text-3xl font-bold text-foreground">Job Dashboard</h1>
                <p className="text-muted-foreground mt-1 text-sm">
                  Manage your job postings and resume applications
                </p>
              </div>
            </div>
            
            <div className="flex gap-2">
              <Button 
                variant="outline"
                onClick={() => dispatch(fetchJobs())}
                disabled={isLoading}
                className="shadow-sm"
              >
                <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
                Refresh
              </Button>
              <Button 
                onClick={() => setIsAddJobModalOpen(true)}
                className="bg-primary text-primary-foreground hover:bg-primary-hover shadow-sm"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Job Post
              </Button>
            </div>
          </header>

          <section>
            {isLoading ? (
              <div className="flex items-center justify-center py-16">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-10 w-10 border-2 border-primary border-t-transparent mx-auto mb-4"></div>
                  <p className="text-muted-foreground font-medium">Loading jobs...</p>
                </div>
              </div>
            ) : jobs.length === 0 ? (
              <div className="text-center py-16">
                <div className="max-w-md mx-auto p-8 bg-card border border-border rounded-lg shadow-sm">
                  <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                    <Briefcase className="w-8 h-8 text-muted-foreground" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2 text-card-foreground">No Job Posts Yet</h3>
                  <p className="text-muted-foreground mb-6 text-sm leading-relaxed">
                    Get started by creating your first job posting to attract qualified candidates.
                  </p>
                  <Button 
                    onClick={() => setIsAddJobModalOpen(true)}
                    className="bg-primary text-primary-foreground hover:bg-primary-hover"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Create First Job Post
                  </Button>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 2xl:grid-cols-3 gap-6 max-w-none">
                {jobs.map((job) => (
                  <JobCard
                    key={job.id || `job-${Math.random()}`}
                    job={job}
                    onViewDetails={handleViewDetails}
                    onUploadResumes={handleUploadResumes}
                    onViewMatched={handleViewMatched}
                    onPostToSocial={handlePostToSocial}
                    onEditJob={handleEditJob}
                    onDeleteJob={handleDeleteJob}
                    onCreateJobPost={handleCreateJobPost}
                  />
                ))}
              </div>
            )}
          </section>

          {/* Job Posts Section */}
          <section className="mt-12">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold text-foreground">Job Posts</h2>
                <p className="text-muted-foreground mt-1 text-sm">
                  Published job posts with AI-generated descriptions
                </p>
              </div>
              <Button 
                variant="outline"
                onClick={() => dispatch(fetchJobPosts({ skip: 0, limit: 100 }))}
                disabled={jobPostsLoading}
                className="shadow-sm"
              >
                <RefreshCw className={`w-4 h-4 mr-2 ${jobPostsLoading ? 'animate-spin' : ''}`} />
                Refresh
              </Button>
            </div>

            {jobPostsLoading ? (
              <div className="flex items-center justify-center py-16">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-10 w-10 border-2 border-primary border-t-transparent mx-auto mb-4"></div>
                  <p className="text-muted-foreground font-medium">Loading job posts...</p>
                </div>
              </div>
            ) : jobPosts.length === 0 ? (
              <div className="text-center py-16">
                <div className="max-w-md mx-auto p-8 bg-card border border-border rounded-lg shadow-sm">
                  <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                    <FileText className="w-8 h-8 text-muted-foreground" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2 text-card-foreground">No Job Posts Yet</h3>
                  <p className="text-muted-foreground mb-6 text-sm leading-relaxed">
                    Create job posts from your requisitions to publish them to external job portals.
                  </p>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 2xl:grid-cols-3 gap-6 max-w-none">
                {jobPosts.map((jobPost) => (
                  <JobPostCard
                    key={jobPost.id}
                    jobPost={jobPost}
                    onViewDetails={handleViewJobPostDetails}
                    onEditJobPost={handleEditJobPost}
                    onDeleteJobPost={handleDeleteJobPost}
                    onPublishJobPost={handlePublishJobPost}
                    onRegenerateDescription={handleRegenerateDescription}
                  />
                ))}
              </div>
            )}
          </section>
        </div>

        {/* Modals */}
      <AddJobModal
        isOpen={isAddJobModalOpen}
        onClose={() => setIsAddJobModalOpen(false)}
      />
      
      <UpdateJobModal
        job={jobToEdit}
        isOpen={isUpdateJobModalOpen}
        onClose={() => {
          setIsUpdateJobModalOpen(false);
          setJobToEdit(null);
        }}
      />
      
      <DeleteJobModal
        job={jobToDelete}
        isOpen={isDeleteJobModalOpen}
        onClose={() => {
          setIsDeleteJobModalOpen(false);
          setJobToDelete(null);
        }}
      />
      
      <JobDetailsModal
        job={selectedJob}
        isOpen={isJobDetailsModalOpen}
        onClose={() => setIsJobDetailsModalOpen(false)}
      />
      
      <UploadResumesModal
        isOpen={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
        jobId={selectedJobId}
      />
      
      <MatchedResumesModal
        isOpen={isMatchedModalOpen}
        onClose={() => setIsMatchedModalOpen(false)}
        jobId={selectedJobId}
      />

      <CreateJobPostModal
        requisitionId={jobToCreatePost?.id ? parseInt(jobToCreatePost.id) : 0}
        requisitionTitle={jobToCreatePost?.title || ''}
        isOpen={isCreateJobPostModalOpen}
        onClose={() => {
          setIsCreateJobPostModalOpen(false);
          setJobToCreatePost(null);
        }}
      />

      <JobPostDetailsModal
        jobPost={selectedJobPost}
        isOpen={isJobPostDetailsModalOpen}
        onClose={() => setIsJobPostDetailsModalOpen(false)}
        onRegenerateDescription={handleRegenerateDescription}
      />

      <PublishJobPostModal
        jobPost={jobPostToPublish}
        isOpen={isPublishJobPostModalOpen}
        onClose={() => {
          setIsPublishJobPostModalOpen(false);
          setJobPostToPublish(null);
        }}
      />

      <UpdateJobPostModal
        jobPost={jobPostToEdit}
        isOpen={isUpdateJobPostModalOpen}
        onClose={() => {
          setIsUpdateJobPostModalOpen(false);
          setJobPostToEdit(null);
        }}
      />

      <DeleteJobPostModal
        jobPost={jobPostToDelete}
        isOpen={isDeleteJobPostModalOpen}
        onClose={() => {
          setIsDeleteJobPostModalOpen(false);
          setJobPostToDelete(null);
        }}
      />
    </div>
  );
};