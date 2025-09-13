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
    <Card className="dashboard-card group">
      {/* Header */}
      <CardHeader className="pb-4">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <h3 className="font-semibold text-lg mb-2 text-card-foreground group-hover:text-primary transition-colors">
              {job.title}
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-muted-foreground text-xs">
              <div className="flex items-center">
                <Calendar className="w-3 h-3 mr-1.5" />
                <span>{formatDate(job.datePosted)}</span>
              </div>
              <div className="flex items-center">
                <MapPin className="w-3 h-3 mr-1.5" />
                <span>{job.location}</span>
              </div>
              <div className="flex items-center">
                <Briefcase className="w-3 h-3 mr-1.5" />
                <span>{job.experience}+ years</span>
              </div>
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
        <div className="flex flex-wrap gap-1.5">
          {job.skills.slice(0, 4).map((skill, index) => (
            <span key={index} className="skill-badge">
              {skill}
            </span>
          ))}
          {job.skills.length > 4 && (
            <span className="skill-badge border border-border bg-transparent">
              +{job.skills.length - 4}
            </span>
          )}
        </div>

        {/* Actions - all in one row */}
        <div className="flex flex-wrap gap-2 pt-2 border-t border-border">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onViewDetails(job)}
            className="flex-1 sm:flex-none min-w-[90px] hover:bg-primary hover:text-primary-foreground"
          >
            <Eye className="w-4 h-4 mr-2" />
            View
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className="flex-1 sm:flex-none min-w-[90px] hover:bg-accent hover:text-accent-foreground"
              >
                <Share2 className="w-4 h-4 mr-2" />
                Post
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="bg-popover border border-border shadow-lg z-50">
              <DropdownMenuItem onClick={() => onPostToSocial(job.id, "linkedin")}>
                LinkedIn
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onPostToSocial(job.id, "instagram")}>
                Instagram
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <Button
            variant="outline"
            size="sm"
            onClick={() => onUploadResumes(job.id)}
            className="flex-1 sm:flex-none min-w-[90px] hover:bg-secondary hover:text-secondary-foreground"
          >
            <Upload className="w-4 h-4 mr-2" />
            Upload
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={() => onViewMatched(job.id)}
            className="flex-1 sm:flex-none min-w-[90px] hover:bg-muted-dark hover:text-foreground"
          >
            <Users className="w-4 h-4 mr-2" />
            Matched
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
