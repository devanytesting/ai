import React from "react";
import {
  Calendar,
  MapPin,
  Briefcase,
  Eye,
  Share2,
  Edit,
  Trash2,
  RefreshCw,
  Globe,
  Clock,
} from "lucide-react";
import { JobPost } from "../../features/jobPosts/jobPostsSlice";
import { Card, CardContent, CardHeader } from "../ui/card";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";

interface JobPostCardProps {
  jobPost: JobPost;
  onViewDetails: (jobPost: JobPost) => void;
  onEditJobPost: (jobPost: JobPost) => void;
  onDeleteJobPost: (jobPost: JobPost) => void;
  onPublishJobPost: (jobPost: JobPost) => void;
  onRegenerateDescription: (jobPost: JobPost) => void;
}

export const JobPostCard: React.FC<JobPostCardProps> = ({
  jobPost,
  onViewDetails,
  onEditJobPost,
  onDeleteJobPost,
  onPublishJobPost,
  onRegenerateDescription,
}) => {
  const formatDate = (dateString: string) =>
    new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });

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
    <Card className="group shadow-md hover:shadow-lg transition-all duration-200 border border-border rounded-xl bg-card overflow-hidden">
      {/* Header */}
      <CardHeader className="pb-4">
        <div className="space-y-2">
          <div className="flex items-start justify-between">
            <h3 className="text-xl font-bold text-card-foreground group-hover:text-primary transition-colors leading-tight flex-1">
              {jobPost.title}
            </h3>
            <div className="flex items-center space-x-2 ml-4">
              <Badge className={`text-xs font-medium ${getStatusColor(jobPost.status)}`}>
                {jobPost.status}
              </Badge>
              {isExpired && (
                <Badge variant="destructive" className="text-xs">
                  Expired
                </Badge>
              )}
            </div>
          </div>
          
          <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-1.5">
              <Calendar className="w-4 h-4 text-primary" />
              <span className="font-medium">Created: {formatDate(jobPost.created_at)}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <MapPin className="w-4 h-4 text-primary" />
              <span className="font-medium">{jobPost.location}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Briefcase className="w-4 h-4 text-primary" />
              <span className="font-medium">{jobPost.experience_required}+ yrs</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-primary" />
              <span className="font-medium">Expires: {formatDate(jobPost.expires_at)}</span>
            </div>
          </div>
        </div>
      </CardHeader>

      {/* Body */}
      <CardContent className="space-y-4">
        {/* Description */}
        <p className="text-sm text-muted-foreground leading-relaxed line-clamp-3">
          {jobPost.description}
        </p>

        {/* Skills */}
        <div className="flex flex-wrap gap-2">
          {(jobPost.skills_required || []).slice(0, 4).map((skill, index) => (
            <span
              key={index}
              className="bg-primary/10 text-primary text-xs font-semibold px-3 py-1.5 rounded-full border border-primary/20"
            >
              {skill}
            </span>
          ))}
          {(jobPost.skills_required || []).length > 4 && (
            <span className="bg-muted text-muted-foreground text-xs font-semibold px-3 py-1.5 rounded-full border border-border">
              +{(jobPost.skills_required || []).length - 4} more
            </span>
          )}
        </div>

        {/* Published Portals */}
        {jobPost.published_portals && jobPost.published_portals.length > 0 && (
          <div className="flex items-center gap-2">
            <Globe className="w-4 h-4 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">Published on:</span>
            <div className="flex flex-wrap gap-1">
              {jobPost.published_portals.map((portal, index) => (
                <Badge key={index} variant="outline" className="text-xs">
                  {portal}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="pt-4 border-t border-border">
          <div className="flex flex-wrap gap-2 justify-start">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onViewDetails(jobPost)}
              className="h-9 border-primary/30 text-primary hover:bg-primary hover:text-white flex items-center gap-1.5 font-medium"
            >
              <Eye className="w-4 h-4" />
              <span className="hidden sm:inline">View</span>
            </Button>

            <Button
              variant="outline"
              size="sm"
              onClick={() => onEditJobPost(jobPost)}
              className="h-9 border-blue-500/30 text-blue-600 hover:bg-blue-500 hover:text-white flex items-center gap-1.5 font-medium"
            >
              <Edit className="w-4 h-4" />
              <span className="hidden sm:inline">Edit</span>
            </Button>

            <Button
              variant="outline"
              size="sm"
              onClick={() => onRegenerateDescription(jobPost)}
              className="h-9 border-purple-500/30 text-purple-600 hover:bg-purple-500 hover:text-white flex items-center gap-1.5 font-medium"
            >
              <RefreshCw className="w-4 h-4" />
              <span className="hidden sm:inline">Regenerate</span>
            </Button>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className="h-9 border-green-500/30 text-green-600 hover:bg-green-500 hover:text-white flex items-center gap-1.5 font-medium"
                >
                  <Share2 className="w-4 h-4" />
                  <span className="hidden sm:inline">Publish</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="bg-popover border border-border shadow-lg z-50 min-w-[120px]">
                <DropdownMenuItem
                  onClick={() => onPublishJobPost(jobPost)}
                  className="cursor-pointer"
                >
                  LinkedIn
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => onPublishJobPost(jobPost)}
                  className="cursor-pointer"
                >
                  Indeed
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => onPublishJobPost(jobPost)}
                  className="cursor-pointer"
                >
                  Glassdoor
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <Button
              variant="outline"
              size="sm"
              onClick={() => onDeleteJobPost(jobPost)}
              className="h-9 border-red-500/30 text-red-600 hover:bg-red-500 hover:text-white flex items-center gap-1.5 font-medium"
            >
              <Trash2 className="w-4 h-4" />
              <span className="hidden sm:inline">Delete</span>
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
