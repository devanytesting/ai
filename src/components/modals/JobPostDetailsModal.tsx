import React from 'react';
import { Calendar, MapPin, Briefcase, Globe, Clock, RefreshCw } from 'lucide-react';
import { JobPost } from '../../features/jobPosts/jobPostsSlice';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';

interface JobPostDetailsModalProps {
  jobPost: JobPost | null;
  isOpen: boolean;
  onClose: () => void;
  onRegenerateDescription?: (jobPost: JobPost) => void;
}

export const JobPostDetailsModal: React.FC<JobPostDetailsModalProps> = ({
  jobPost,
  isOpen,
  onClose,
  onRegenerateDescription,
}) => {
  if (!jobPost) return null;

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'published':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'draft':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'expired':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const isExpired = new Date(jobPost.expires_at) < new Date();

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] flex flex-col">
        <DialogHeader className="flex-shrink-0">
          <DialogTitle className="flex items-center justify-between">
            <span>{jobPost.title}</span>
            <div className="flex items-center space-x-2">
              <Badge className={`text-xs font-medium ${getStatusColor(jobPost.status)}`}>
                {jobPost.status}
              </Badge>
              {isExpired && (
                <Badge variant="destructive" className="text-xs">
                  Expired
                </Badge>
              )}
            </div>
          </DialogTitle>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto pr-2">
          <div className="space-y-6">
            <div className="flex items-center text-muted-foreground space-x-6">
              <div className="flex items-center">
                <Calendar className="w-4 h-4 mr-2" />
                Created: {formatDate(jobPost.created_at)}
              </div>
              <div className="flex items-center">
                <MapPin className="w-4 h-4 mr-2" />
                {jobPost.location}
              </div>
              <div className="flex items-center">
                <Briefcase className="w-4 h-4 mr-2" />
                {jobPost.experience_required}+ years experience
              </div>
              <div className="flex items-center">
                <Clock className="w-4 h-4 mr-2" />
                Expires: {formatDate(jobPost.expires_at)}
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold">Job Description</h3>
                {onRegenerateDescription && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onRegenerateDescription(jobPost)}
                    className="flex items-center gap-2"
                  >
                    <RefreshCw className="w-4 h-4" />
                    Regenerate with AI
                  </Button>
                )}
              </div>
              <div className="prose prose-sm max-w-none">
                <p className="text-foreground whitespace-pre-wrap">{jobPost.description}</p>
              </div>
            </div>

            <div>
              <h3 className="font-semibold mb-3">Required Skills</h3>
              <div className="flex flex-wrap gap-2">
                {(jobPost.skills_required || []).map((skill, index) => (
                  <Badge key={index} variant="secondary">
                    {skill}
                  </Badge>
                ))}
              </div>
            </div>

            <div>
              <h3 className="font-semibold mb-3">Job Details</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="text-sm font-medium text-muted-foreground">Employment Type:</span>
                  <p className="text-sm">{jobPost.employment_type}</p>
                </div>
                <div>
                  <span className="text-sm font-medium text-muted-foreground">Salary Range:</span>
                  <p className="text-sm">
                    ${jobPost.salary_range_min?.toLocaleString()} - ${jobPost.salary_range_max?.toLocaleString()}
                  </p>
                </div>
                <div>
                  <span className="text-sm font-medium text-muted-foreground">Requisition ID:</span>
                  <p className="text-sm">{jobPost.requisition_id}</p>
                </div>
                <div>
                  <span className="text-sm font-medium text-muted-foreground">Created By:</span>
                  <p className="text-sm">User {jobPost.created_by}</p>
                </div>
              </div>
            </div>

            {jobPost.published_portals && jobPost.published_portals.length > 0 && (
              <div>
                <h3 className="font-semibold mb-3">Published Portals</h3>
                <div className="flex flex-wrap gap-2">
                  {jobPost.published_portals.map((portal, index) => (
                    <Badge key={index} variant="outline" className="flex items-center gap-1">
                      <Globe className="w-3 h-3" />
                      {portal}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {jobPost.published_at && (
              <div>
                <h3 className="font-semibold mb-3">Publication Details</h3>
                <div className="text-sm text-muted-foreground">
                  <p>Published: {formatDate(jobPost.published_at)}</p>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="flex justify-end space-x-3 pt-4 border-t border-border">
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
