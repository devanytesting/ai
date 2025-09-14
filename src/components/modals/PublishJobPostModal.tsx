import React, { useState } from 'react';
import { Globe, Check } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '../../hooks/redux';
import { publishJobPost } from '../../features/jobPosts/jobPostsSlice';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog';
import { Button } from '../ui/button';
import { Checkbox } from '../ui/checkbox';
import { Label } from '../ui/label';
import { useToast } from '../../hooks/use-toast';
import { JobPost } from '../../features/jobPosts/jobPostsSlice';

interface PublishJobPostModalProps {
  jobPost: JobPost | null;
  isOpen: boolean;
  onClose: () => void;
}

const AVAILABLE_PORTALS = [
  { id: 'linkedin', name: 'LinkedIn', description: 'Professional networking platform' },
  { id: 'indeed', name: 'Indeed', description: 'Job search engine' },
  { id: 'glassdoor', name: 'Glassdoor', description: 'Company reviews and job listings' },
  { id: 'monster', name: 'Monster', description: 'Career and job search platform' },
  { id: 'ziprecruiter', name: 'ZipRecruiter', description: 'Job matching platform' },
];

export const PublishJobPostModal: React.FC<PublishJobPostModalProps> = ({
  jobPost,
  isOpen,
  onClose,
}) => {
  const dispatch = useAppDispatch();
  const { toast } = useToast();
  const { isLoading } = useAppSelector((state) => state.jobPosts);

  const [selectedPortals, setSelectedPortals] = useState<string[]>([]);

  const handlePortalToggle = (portalId: string) => {
    setSelectedPortals(prev => 
      prev.includes(portalId) 
        ? prev.filter(id => id !== portalId)
        : [...prev, portalId]
    );
  };

  const handlePublish = async () => {
    if (!jobPost || selectedPortals.length === 0) return;

    try {
      await dispatch(publishJobPost({
        jobPostId: jobPost.id,
        publishData: { portals: selectedPortals }
      })).unwrap();

      toast({
        title: 'Success',
        description: `Job post published to ${selectedPortals.length} portal(s) successfully!`,
      });

      onClose();
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to publish job post. Please try again.',
        variant: 'destructive',
      });
    }
  };

  const handleClose = () => {
    setSelectedPortals([]);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Globe className="w-5 h-5" />
            Publish Job Post
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {jobPost && (
            <div className="bg-muted p-4 rounded-lg">
              <h4 className="font-medium text-sm mb-1">{jobPost.title}</h4>
              <p className="text-sm text-muted-foreground">{jobPost.location}</p>
            </div>
          )}

          <div className="space-y-4">
            <Label className="text-base font-medium">Select Job Portals</Label>
            <div className="space-y-3">
              {AVAILABLE_PORTALS.map((portal) => (
                <div key={portal.id} className="flex items-start space-x-3">
                  <Checkbox
                    id={portal.id}
                    checked={selectedPortals.includes(portal.id)}
                    onCheckedChange={() => handlePortalToggle(portal.id)}
                  />
                  <div className="flex-1">
                    <Label htmlFor={portal.id} className="text-sm font-medium cursor-pointer">
                      {portal.name}
                    </Label>
                    <p className="text-xs text-muted-foreground">{portal.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {selectedPortals.length > 0 && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0">
                  <Check className="w-5 h-5 text-blue-600" />
                </div>
                <div className="flex-1">
                  <h4 className="text-sm font-medium text-blue-900">Ready to Publish</h4>
                  <p className="text-sm text-blue-700 mt-1">
                    This job post will be published to {selectedPortals.length} portal(s):{' '}
                    {selectedPortals.map(id => AVAILABLE_PORTALS.find(p => p.id === id)?.name).join(', ')}
                  </p>
                </div>
              </div>
            </div>
          )}

          <div className="flex justify-end space-x-3 pt-4">
            <Button variant="outline" onClick={handleClose}>
              Cancel
            </Button>
            <Button 
              onClick={handlePublish} 
              disabled={selectedPortals.length === 0 || isLoading}
            >
              {isLoading ? 'Publishing...' : `Publish to ${selectedPortals.length} Portal(s)`}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
