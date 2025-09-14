import React, { useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../hooks/redux';
import { createJobPost } from '../../features/jobPosts/jobPostsSlice';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { useToast } from '../../hooks/use-toast';

interface CreateJobPostModalProps {
  requisitionId: number;
  requisitionTitle: string;
  isOpen: boolean;
  onClose: () => void;
}

export const CreateJobPostModal: React.FC<CreateJobPostModalProps> = ({
  requisitionId,
  requisitionTitle,
  isOpen,
  onClose,
}) => {
  const dispatch = useAppDispatch();
  const { toast } = useToast();
  const { isLoading } = useAppSelector((state) => state.jobPosts);

  const [expiresInDays, setExpiresInDays] = useState<number>(30);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await dispatch(createJobPost({
        requisition_id: requisitionId,
        expires_in_days: expiresInDays,
      })).unwrap();

      toast({
        title: 'Success',
        description: 'Job post created successfully with AI-generated description!',
      });

      onClose();
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to create job post. Please try again.',
        variant: 'destructive',
      });
    }
  };

  const handleClose = () => {
    setExpiresInDays(30);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Create Job Post</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="requisition">Requisition</Label>
            <Input
              id="requisition"
              value={requisitionTitle}
              disabled
              className="bg-muted"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="expires_in_days">Expires In (Days)</Label>
            <Select
              value={expiresInDays.toString()}
              onValueChange={(value) => setExpiresInDays(parseInt(value))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select expiration period" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="7">7 days</SelectItem>
                <SelectItem value="15">15 days</SelectItem>
                <SelectItem value="30">30 days</SelectItem>
                <SelectItem value="60">60 days</SelectItem>
                <SelectItem value="90">90 days</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0">
                <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center">
                  <span className="text-blue-600 text-sm font-semibold">AI</span>
                </div>
              </div>
              <div className="flex-1">
                <h4 className="text-sm font-medium text-blue-900">AI-Generated Description</h4>
                <p className="text-sm text-blue-700 mt-1">
                  The job description will be automatically generated using AI based on the requisition details.
                </p>
              </div>
            </div>
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <Button type="button" variant="outline" onClick={handleClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? 'Creating...' : 'Create Job Post'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
