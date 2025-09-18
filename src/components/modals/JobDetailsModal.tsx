// Modal: read-only view of a job requisition details
import React from 'react';
import { Calendar, MapPin, Briefcase, X } from 'lucide-react';
import { Job } from '../../features/jobs/jobsSlice';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';

/**
 * Props for JobDetailsModal
 */
interface JobDetailsModalProps {
  job: Job | null;
  isOpen: boolean;
  onClose: () => void;
}

export const JobDetailsModal: React.FC<JobDetailsModalProps> = ({
  job,
  isOpen,
  onClose,
}) => {
  if (!job) return null;

  // Pretty-print the posted date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] flex flex-col">
        <DialogHeader className="flex-shrink-0">
          <DialogTitle className="flex items-center justify-between">
            <span>{job.title || 'Untitled Job'}</span>
          </DialogTitle>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto pr-2">
          <div className="space-y-6">
          <div className="flex items-center text-muted-foreground space-x-6">
            <div className="flex items-center">
              <Calendar className="w-4 h-4 mr-2" />
              {job.datePosted ? formatDate(job.datePosted) : 'No date'}
            </div>
            <div className="flex items-center">
              <MapPin className="w-4 h-4 mr-2" />
              {job.location || 'Location not specified'}
            </div>
            <div className="flex items-center">
              <Briefcase className="w-4 h-4 mr-2" />
              {job.experience || 0}+ years experience
            </div>
          </div>

          <div>
            <h3 className="font-semibold mb-3">Job Description</h3>
            <div className="prose prose-sm max-w-none">
              <p className="text-foreground whitespace-pre-wrap">{job.description || 'No description available'}</p>
            </div>
          </div>

          <div>
            <h3 className="font-semibold mb-3">Required Skills</h3>
            <div className="flex flex-wrap gap-2">
              {(job.skills || []).map((skill, index) => (
                <Badge key={index} variant="secondary">
                  {skill}
                </Badge>
              ))}
            </div>
          </div>

          <div className="flex justify-end space-x-3 pt-4 border-t border-border">
            <Button variant="outline" onClick={onClose}>
              Close
            </Button>
            
          </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};