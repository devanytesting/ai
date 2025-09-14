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
    <Card className="group shadow-sm hover:shadow-lg transition-all duration-300 border border-slate-200 rounded-xl bg-white overflow-hidden hover:border-green-300">
      {/* Header */}
      <CardHeader className="pb-4 bg-gradient-to-r from-green-50 to-emerald-50 border-b border-slate-100">
        <div className="space-y-3">
          <div className="flex items-start justify-between">
            <h3 className="text-lg font-bold text-slate-900 group-hover:text-green-700 transition-colors leading-tight flex-1 pr-2">
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
          
          <div className="flex flex-wrap gap-3 text-sm text-slate-600">
            <div className="flex items-center gap-1.5">
              <Calendar className="w-4 h-4 text-green-600" />
              <span className="font-medium">Created: {formatDate(jobPost.created_at)}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <MapPin className="w-4 h-4 text-green-600" />
              <span className="font-medium">{jobPost.location}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Briefcase className="w-4 h-4 text-green-600" />
              <span className="font-medium">{jobPost.experience_required}+ yrs</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-green-600" />
              <span className="font-medium">Expires: {formatDate(jobPost.expires_at)}</span>
            </div>
          </div>
        </div>
      </CardHeader>

      {/* Body */}
      <CardContent className="p-6 space-y-4">
        {/* Description */}
        <p className="text-sm text-slate-600 leading-relaxed line-clamp-3">
          {jobPost.description}
        </p>

        {/* Skills */}
        <div className="flex flex-wrap gap-2">
          {(jobPost.skills_required || []).slice(0, 4).map((skill, index) => (
            <span
              key={index}
              className="bg-green-100 text-green-700 text-xs font-medium px-3 py-1.5 rounded-full border border-green-200"
            >
              {skill}
            </span>
          ))}
          {(jobPost.skills_required || []).length > 4 && (
            <span className="bg-slate-200 text-slate-600 text-xs font-medium px-3 py-1.5 rounded-full border border-slate-300">
              +{(jobPost.skills_required || []).length - 4} more
            </span>
          )}
        </div>

        {/* Published Portals */}
        {jobPost.published_portals && jobPost.published_portals.length > 0 && (
          <div className="flex items-center gap-2">
            <Globe className="w-4 h-4 text-slate-500" />
            <span className="text-sm text-slate-600">Published on:</span>
            <div className="flex flex-wrap gap-1">
              {jobPost.published_portals.map((portal, index) => (
                <Badge key={index} variant="outline" className="text-xs border-slate-300 text-slate-700">
                  {portal}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="pt-4 border-t border-slate-100">
          <div className="flex flex-wrap gap-2 justify-start">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onViewDetails(jobPost)}
              className="h-9 border-green-200 text-green-700 hover:bg-green-50 hover:border-green-300 flex items-center gap-1.5 font-medium text-xs"
            >
              <Eye className="w-4 h-4" />
              <span className="hidden sm:inline">View</span>
            </Button>

            <Button
              variant="outline"
              size="sm"
              onClick={() => onEditJobPost(jobPost)}
              className="h-9 border-slate-200 text-slate-700 hover:bg-slate-50 hover:border-slate-300 flex items-center gap-1.5 font-medium text-xs"
            >
              <Edit className="w-4 h-4" />
              <span className="hidden sm:inline">Edit</span>
            </Button>

            <Button
              variant="outline"
              size="sm"
              onClick={() => onRegenerateDescription(jobPost)}
              className="h-9 border-purple-200 text-purple-700 hover:bg-purple-50 hover:border-purple-300 flex items-center gap-1.5 font-medium text-xs"
            >
              <RefreshCw className="w-4 h-4" />
              <span className="hidden sm:inline">Regenerate</span>
            </Button>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className="h-9 border-blue-200 text-blue-700 hover:bg-blue-50 hover:border-blue-300 flex items-center gap-1.5 font-medium text-xs"
                >
                  <Share2 className="w-4 h-4" />
                  <span className="hidden sm:inline">Publish</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="bg-white border border-slate-200 shadow-lg z-50 min-w-[120px]">
                <DropdownMenuItem
                  onClick={() => onPublishJobPost(jobPost)}
                  className="cursor-pointer hover:bg-slate-50"
                >
                  LinkedIn
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => onPublishJobPost(jobPost)}
                  className="cursor-pointer hover:bg-slate-50"
                >
                  Indeed
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => onPublishJobPost(jobPost)}
                  className="cursor-pointer hover:bg-slate-50"
                >
                  Glassdoor
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <Button
              variant="outline"
              size="sm"
              onClick={() => onDeleteJobPost(jobPost)}
              className="h-9 border-red-200 text-red-700 hover:bg-red-50 hover:border-red-300 flex items-center gap-1.5 font-medium text-xs"
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
