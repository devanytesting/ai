import React from "react";
import {
  Calendar,
  MapPin,
  Briefcase,
  Eye,
  Share2,
  Upload,
  Users,
  Edit,
  Trash2,
  FileText,
} from "lucide-react";
import { Job } from "../../features/jobs/jobsSlice";
import { Card, CardContent, CardHeader } from "../ui/card";
import { Button } from "../ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";

interface JobCardProps {
  job: Job;
  onViewDetails: (job: Job) => void;
  onUploadResumes: (jobId: string) => void;
  onViewMatched: (jobId: string) => void;
  onPostToSocial: (jobId: string, platform: "instagram" | "linkedin") => void;
  onEditJob: (job: Job) => void;
  onDeleteJob: (job: Job) => void;
  onCreateJobPost: (job: Job) => void;
}

export const JobCard: React.FC<JobCardProps> = ({
  job,
  onViewDetails,
  onUploadResumes,
  onViewMatched,
  onPostToSocial,
  onEditJob,
  onDeleteJob,
  onCreateJobPost,
}) => {
  const formatDate = (dateString: string) =>
    new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });

  return (
    <Card className="group shadow-md hover:shadow-lg transition-all duration-200 border border-border rounded-xl bg-card overflow-hidden">
      {/* Header */}
      <CardHeader className="pb-4">
        <div className="space-y-2">
          <h3 className="text-xl font-bold text-card-foreground group-hover:text-primary transition-colors leading-tight">
            {job.title || 'Untitled Job'}
          </h3>
          <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-1.5">
              <Calendar className="w-4 h-4 text-primary" />
              <span className="font-medium">{job.datePosted ? formatDate(job.datePosted) : 'No date'}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <MapPin className="w-4 h-4 text-primary" />
              <span className="font-medium">{job.location || 'Location not specified'}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Briefcase className="w-4 h-4 text-primary" />
              <span className="font-medium">{job.experience || 0}+ yrs</span>
            </div>
          </div>
        </div>
      </CardHeader>

      {/* Body */}
      <CardContent className="space-y-4">
        {/* Description */}
        <p className="text-sm text-muted-foreground leading-relaxed line-clamp-3">
          {job.description || 'No description available'}
        </p>

        {/* Skills */}
        <div className="flex flex-wrap gap-2">
          {(job.skills || []).slice(0, 4).map((skill, index) => (
            <span
              key={index}
              className="bg-primary/10 text-primary text-xs font-semibold px-3 py-1.5 rounded-full border border-primary/20"
            >
              {skill}
            </span>
          ))}
          {(job.skills || []).length > 4 && (
            <span className="bg-muted text-muted-foreground text-xs font-semibold px-3 py-1.5 rounded-full border border-border">
              +{(job.skills || []).length - 4} more
            </span>
          )}
        </div>

        {/* Action Buttons */}
        <div className="pt-4 border-t border-border">
          <div className="flex flex-wrap gap-2 justify-start">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onViewDetails(job)}
              className="h-9 border-primary/30 text-primary hover:bg-primary hover:text-white flex items-center gap-1.5 font-medium"
            >
              <Eye className="w-4 h-4" />
              <span className="hidden sm:inline">View</span>
            </Button>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className="h-9 border-indigo-500/30 text-indigo-600 hover:bg-indigo-500 hover:text-white flex items-center gap-1.5 font-medium"
                >
                  <Share2 className="w-4 h-4" />
                  <span className="hidden sm:inline">Post</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="bg-popover border border-border shadow-lg z-50 min-w-[120px]">
                <DropdownMenuItem
                  onClick={() => onPostToSocial(job.id || '', "linkedin")}
                  className="cursor-pointer"
                >
                  LinkedIn
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => onPostToSocial(job.id || '', "instagram")}
                  className="cursor-pointer"
                >
                  Instagram
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <Button
              variant="outline"
              size="sm"
              onClick={() => onUploadResumes(job.id || '')}
              className="h-9 border-green-500/30 text-green-600 hover:bg-green-500 hover:text-white flex items-center gap-1.5 font-medium"
            >
              <Upload className="w-4 h-4" />
              <span className="hidden sm:inline">Upload</span>
            </Button>

            <Button
              variant="outline"
              size="sm"
              onClick={() => onViewMatched(job.id || '')}
              className="h-9 border-purple-500/30 text-purple-600 hover:bg-purple-500 hover:text-white flex items-center gap-1.5 font-medium"
            >
              <Users className="w-4 h-4" />
              <span className="hidden sm:inline">Matched</span>
            </Button>

            <Button
              variant="outline"
              size="sm"
              onClick={() => onCreateJobPost(job)}
              className="h-9 border-orange-500/30 text-orange-600 hover:bg-orange-500 hover:text-white flex items-center gap-1.5 font-medium"
            >
              <FileText className="w-4 h-4" />
              <span className="hidden sm:inline">Create Post</span>
            </Button>

            <Button
              variant="outline"
              size="sm"
              onClick={() => onEditJob(job)}
              className="h-9 border-blue-500/30 text-blue-600 hover:bg-blue-500 hover:text-white flex items-center gap-1.5 font-medium"
            >
              <Edit className="w-4 h-4" />
              <span className="hidden sm:inline">Edit</span>
            </Button>

            <Button
              variant="outline"
              size="sm"
              onClick={() => onDeleteJob(job)}
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
