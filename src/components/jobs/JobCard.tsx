import React from "react";
import {
  Calendar,
  MapPin,
  Briefcase,
  Eye,
  Share2,
  Upload,
  Users,
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
}

export const JobCard: React.FC<JobCardProps> = ({
  job,
  onViewDetails,
  onUploadResumes,
  onViewMatched,
  onPostToSocial,
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
        <div className="space-y-3">
          <h3 className="text-xl font-bold text-card-foreground group-hover:text-primary transition-colors leading-tight">
            {job.title}
          </h3>
          <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-1.5">
              <Calendar className="w-4 h-4 text-primary" />
              <span className="font-medium">{formatDate(job.datePosted)}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <MapPin className="w-4 h-4 text-primary" />
              <span className="font-medium">{job.location}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Briefcase className="w-4 h-4 text-primary" />
              <span className="font-medium">{job.experience}+ years</span>
            </div>
          </div>
        </div>
      </CardHeader>

      {/* Body */}
      <CardContent className="space-y-4">
        {/* Description */}
        <p className="text-sm text-muted-foreground leading-relaxed line-clamp-3">
          {job.description}
        </p>

        {/* Skills */}
        <div className="flex flex-wrap gap-2">
          {job.skills.slice(0, 4).map((skill, index) => (
            <span
              key={index}
              className="bg-primary/10 text-primary text-xs font-semibold px-3 py-1.5 rounded-full border border-primary/20"
            >
              {skill}
            </span>
          ))}
          {job.skills.length > 4 && (
            <span className="bg-muted text-muted-foreground text-xs font-semibold px-3 py-1.5 rounded-full border border-border">
              +{job.skills.length - 4} more
            </span>
          )}
        </div>

        {/* Action Buttons - Single Clean Row */}
        <div className="pt-4 border-t border-border">
          <div className="grid grid-cols-4 gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onViewDetails(job)}
              className="h-9 border-primary/30 text-primary hover:bg-primary hover:text-white transition-all duration-200 flex items-center justify-center gap-1.5 font-medium"
            >
              <Eye className="w-4 h-4" />
              <span className="hidden sm:inline">View</span>
            </Button>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className="h-9 border-indigo-500/30 text-indigo-600 hover:bg-indigo-500 hover:text-white transition-all duration-200 flex items-center justify-center gap-1.5 font-medium"
                >
                  <Share2 className="w-4 h-4" />
                  <span className="hidden sm:inline">Post</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="bg-popover border border-border shadow-lg z-50 min-w-[120px]">
                <DropdownMenuItem
                  onClick={() => onPostToSocial(job.id, "linkedin")}
                  className="cursor-pointer"
                >
                  LinkedIn
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => onPostToSocial(job.id, "instagram")}
                  className="cursor-pointer"
                >
                  Instagram
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <Button
              variant="outline"
              size="sm"
              onClick={() => onUploadResumes(job.id)}
              className="h-9 border-green-500/30 text-green-600 hover:bg-green-500 hover:text-white transition-all duration-200 flex items-center justify-center gap-1.5 font-medium"
            >
              <Upload className="w-4 h-4" />
              <span className="hidden sm:inline">Upload</span>
            </Button>

            <Button
              variant="outline"
              size="sm"
              onClick={() => onViewMatched(job.id)}
              className="h-9 border-purple-500/30 text-purple-600 hover:bg-purple-500 hover:text-white transition-all duration-200 flex items-center justify-center gap-1.5 font-medium"
            >
              <Users className="w-4 h-4" />
              <span className="hidden sm:inline">Matched</span>
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
