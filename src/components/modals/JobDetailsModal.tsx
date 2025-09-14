import React from 'react';
import { Calendar, MapPin, Briefcase, X } from 'lucide-react';
import { Job } from '../../features/jobs/jobsSlice';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';

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
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span>{job.title}</span>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          <div className="flex items-center text-muted-foreground space-x-6">
            <div className="flex items-center">
              <Calendar className="w-4 h-4 mr-2" />
              {formatDate(job.datePosted)}
            </div>
            <div className="flex items-center">
              <MapPin className="w-4 h-4 mr-2" />
              {job.location}
            </div>
            <div className="flex items-center">
              <Briefcase className="w-4 h-4 mr-2" />
              {job.experience}+ years experience
            </div>
          </div>

          <div>
            <h3 className="font-semibold mb-3">Job Description</h3>
            <div className="prose prose-sm max-w-none">
              <p className="text-foreground whitespace-pre-wrap">{job.description}</p>
            </div>
          </div>

          <div>
            <h3 className="font-semibold mb-3">Required Skills</h3>
            <div className="flex flex-wrap gap-2">
              {job.skills.map((skill, index) => (
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
      </DialogContent>
    </Dialog>
  );
};