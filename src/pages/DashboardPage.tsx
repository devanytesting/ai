import React, { useEffect, useState } from 'react';
import { Plus, Briefcase, Menu } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '../hooks/redux';
import { fetchJobs, setSelectedJob, postJobToSocial } from '../features/jobs/jobsSlice';
import { Layout } from '../components/layout/Layout';
import { JobCard } from '../components/jobs/JobCard';
import { Job } from '../features/jobs/jobsSlice';
import { JobDetailsModal } from '../components/modals/JobDetailsModal';
import { AddJobModal } from '../components/modals/AddJobModal';
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

  // Modal states
  const [isAddJobModalOpen, setIsAddJobModalOpen] = useState(false);
  const [isJobDetailsModalOpen, setIsJobDetailsModalOpen] = useState(false);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [isMatchedModalOpen, setIsMatchedModalOpen] = useState(false);
  const [selectedJobId, setSelectedJobId] = useState<string>('');

  useEffect(() => {
    dispatch(fetchJobs());
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
            
            <Button 
              onClick={() => setIsAddJobModalOpen(true)}
              className="bg-primary text-primary-foreground hover:bg-primary-hover shadow-sm"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Job Post
            </Button>
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
    </div>
  );
};