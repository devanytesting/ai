import React, { useEffect, useState } from 'react';
import { Plus, Briefcase, Menu, RefreshCw, FileText, TrendingUp, Users, Calendar, BarChart3 } from 'lucide-react';
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
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="p-6 lg:p-8">
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
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
                <h1 className="text-3xl font-bold text-slate-900">Recruitment Dashboard</h1>
                <p className="text-slate-600 mt-1">Manage your job requisitions and posts efficiently</p>
              </div>
            </div>
            
            <div className="flex gap-3">
              <Button 
                variant="outline"
                onClick={() => dispatch(fetchJobs())}
                disabled={isLoading}
                className="bg-white border-slate-200 hover:bg-slate-50 hover:border-slate-300 hover:text-slate-900 shadow-sm transition-all duration-200"
              >
                <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
                Refresh
              </Button>
              <Button 
                onClick={() => setIsAddJobModalOpen(true)}
                className="bg-blue-600 hover:bg-blue-700 hover:shadow-lg text-white shadow-md transition-all duration-200 transform hover:scale-105"
              >
                <Plus className="w-4 h-4 mr-2" />
                Create Requisition
              </Button>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <Card className="bg-white border-slate-200 shadow-sm hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-600">Total Requisitions</p>
                    <p className="text-2xl font-bold text-slate-900">{jobs.length}</p>
                  </div>
                  <div className="p-3 bg-blue-100 rounded-lg">
                    <Briefcase className="w-6 h-6 text-blue-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white border-slate-200 shadow-sm hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-600">Active Job Posts</p>
                    <p className="text-2xl font-bold text-slate-900">{jobPosts.filter(jp => jp.status && jp.status.toLowerCase() === 'published').length}</p>
                  </div>
                  <div className="p-3 bg-green-100 rounded-lg">
                    <TrendingUp className="w-6 h-6 text-green-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white border-slate-200 shadow-sm hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-600">Draft Posts</p>
                    <p className="text-2xl font-bold text-slate-900">{jobPosts.filter(jp => jp.status && jp.status.toLowerCase() === 'draft').length}</p>
                  </div>
                  <div className="p-3 bg-yellow-100 rounded-lg">
                    <FileText className="w-6 h-6 text-yellow-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white border-slate-200 shadow-sm hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-600">Total Applications</p>
                    <p className="text-2xl font-bold text-slate-900">0</p>
                  </div>
                  <div className="p-3 bg-purple-100 rounded-lg">
                    <Users className="w-6 h-6 text-purple-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

          <section>
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold text-slate-900 mb-2">Job Requisitions</h2>
                <p className="text-slate-600">Manage your internal job requirements</p>
              </div>
            <Button
              onClick={() => dispatch(fetchJobs())}
              variant="outline"
              size="sm"
              className="bg-white border-slate-200 hover:bg-slate-50 hover:border-slate-300 hover:text-slate-900 transition-all duration-200"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Refresh
            </Button>
            </div>
            {isLoading ? (
              <div className="flex items-center justify-center py-16">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-10 w-10 border-2 border-blue-600 border-t-transparent mx-auto mb-4"></div>
                  <p className="text-slate-600 font-medium">Loading requisitions...</p>
                </div>
              </div>
            ) : jobs.length === 0 ? (
              <div className="text-center py-16">
                <div className="max-w-md mx-auto p-8 bg-white border border-slate-200 rounded-xl shadow-sm">
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Briefcase className="w-8 h-8 text-blue-600" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2 text-slate-900">No Requisitions Yet</h3>
                  <p className="text-slate-600 mb-6 text-sm leading-relaxed">
                    Get started by creating your first job requisition to begin the hiring process.
                  </p>
                  <Button 
                    onClick={() => setIsAddJobModalOpen(true)}
                    className="bg-blue-600 hover:bg-blue-700 hover:shadow-lg text-white shadow-md transition-all duration-200 transform hover:scale-105"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Create First Requisition
                  </Button>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
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
                <h2 className="text-2xl font-bold text-slate-900 mb-2">Job Posts</h2>
                <p className="text-slate-600">Published job listings and their performance</p>
              </div>
              <Button 
                variant="outline"
                onClick={() => dispatch(fetchJobPosts({ skip: 0, limit: 100 }))}
                disabled={jobPostsLoading}
                className="bg-white border-slate-200 hover:bg-slate-50 hover:border-slate-300 hover:text-slate-900 shadow-sm transition-all duration-200"
              >
                <RefreshCw className={`w-4 h-4 mr-2 ${jobPostsLoading ? 'animate-spin' : ''}`} />
                Refresh
              </Button>
            </div>

            {jobPostsLoading ? (
              <div className="flex items-center justify-center py-16">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-10 w-10 border-2 border-blue-600 border-t-transparent mx-auto mb-4"></div>
                  <p className="text-slate-600 font-medium">Loading job posts...</p>
                </div>
              </div>
            ) : jobPosts.length === 0 ? (
              <div className="text-center py-16">
                <div className="max-w-md mx-auto p-8 bg-white border border-slate-200 rounded-xl shadow-sm">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <TrendingUp className="w-8 h-8 text-green-600" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2 text-slate-900">No Job Posts Yet</h3>
                  <p className="text-slate-600 mb-6 text-sm leading-relaxed">
                    Convert your requisitions to job posts to start attracting candidates.
                  </p>
                  <Button 
                    onClick={() => setIsAddJobModalOpen(true)}
                    className="bg-green-600 hover:bg-green-700 hover:shadow-lg text-white shadow-md transition-all duration-200 transform hover:scale-105"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Create First Post
                  </Button>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
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