import React from 'react';
import { useAppDispatch } from '../../hooks/redux';
import { deleteJobPost } from '../../features/jobPosts/jobPostsSlice';
import { JobPost } from '../../features/jobPosts/jobPostsSlice';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '../ui/dialog';
import { Button } from '../ui/button';
import { toast } from 'sonner';

interface DeleteJobPostModalProps {
  isOpen: boolean;
  onClose: () => void;
  jobPost: JobPost | null;
}

export const DeleteJobPostModal: React.FC<DeleteJobPostModalProps> = ({
  isOpen,
  onClose,
  jobPost,
}) => {
  const dispatch = useAppDispatch();

  const handleDelete = async () => {
    if (!jobPost) return;

    try {
      await dispatch(deleteJobPost(jobPost.id)).unwrap();
      
      toast.success('Job post deleted successfully!', {
        description: `"${jobPost.title}" has been permanently deleted.`,
      });
      onClose();
    } catch (error) {
      toast.error('Failed to delete job post', {
        description: error as string,
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Delete Job Post</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete "{jobPost?.title}"? This action cannot be undone.
          </DialogDescription>
        </DialogHeader>
        
        <div className="flex justify-end space-x-2 pt-4">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="destructive" onClick={handleDelete}>
            Delete
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
