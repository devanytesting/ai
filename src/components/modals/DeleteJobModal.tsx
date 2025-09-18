// Modal: confirm deletion of a job requisition
import React from 'react';
import { AlertTriangle } from 'lucide-react';
import { useAppDispatch } from '../../hooks/redux';
import { deleteJob } from '../../features/jobs/jobsSlice';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog';
import { Button } from '../ui/button';
import { Job } from '../../features/jobs/jobsSlice';

/**
 * Props for DeleteJobModal
 */
interface DeleteJobModalProps {
  job: Job | null;
  isOpen: boolean;
  onClose: () => void;
}

export const DeleteJobModal: React.FC<DeleteJobModalProps> = ({ job, isOpen, onClose }) => {
  const dispatch = useAppDispatch();

  // Confirm and dispatch deletion
  const handleDelete = async () => {
    if (!job?.id) return;

    try {
      await dispatch(deleteJob(job.id));
      onClose();
    } catch (error) {
      console.error('Failed to delete job:', error);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-destructive">
            <AlertTriangle className="w-5 h-5" />
            Delete Job Post
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="text-center">
            <div className="w-16 h-16 bg-destructive/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <AlertTriangle className="w-8 h-8 text-destructive" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Are you sure?</h3>
            <p className="text-muted-foreground mb-4">
              This action cannot be undone. This will permanently delete the job post:
            </p>
            <div className="bg-muted p-3 rounded-lg">
              <p className="font-medium text-foreground">{job?.title || 'Untitled Job'}</p>
              <p className="text-sm text-muted-foreground">{job?.location || 'Location not specified'}</p>
            </div>
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDelete}>
              Delete Job Post
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
