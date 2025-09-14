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
import { Badge } from "../ui/badge";
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
    <Card className="group shadow-sm hover:shadow-lg transition-all duration-300 border border-slate-200 rounded-xl bg-white overflow-hidden hover:border-blue-300">
      {/* Header */}
      <CardHeader className="pb-4 bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-slate-100">
        <div className="space-y-3">
          <div className="flex items-start justify-between">
            <h3 className="text-lg font-bold text-slate-900 group-hover:text-blue-700 transition-colors leading-tight flex-1 pr-2">
              {job.title || 'Untitled Job'}
            </h3>
            <Badge className="bg-blue-100 text-blue-800 border-blue-200 text-xs font-medium px-2 py-1">
              Requisition
            </Badge>
          </div>
          <div className="flex flex-wrap gap-3 text-sm text-slate-600">
            <div className="flex items-center gap-1.5">
              <Calendar className="w-4 h-4 text-blue-600" />
              <span className="font-medium">{job.datePosted ? formatDate(job.datePosted) : 'No date'}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <MapPin className="w-4 h-4 text-blue-600" />
              <span className="font-medium">{job.location || 'Location not specified'}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Briefcase className="w-4 h-4 text-blue-600" />
              <span className="font-medium">{job.experience || 0}+ yrs</span>
            </div>
          </div>
        </div>
      </CardHeader>

      {/* Body */}
      <CardContent className="p-6 space-y-4">
        {/* Description */}
        <p className="text-sm text-slate-600 leading-relaxed line-clamp-3">
          {job.description || 'No description available'}
        </p>

        {/* Skills */}
        <div className="flex flex-wrap gap-2">
          {(job.skills || []).slice(0, 4).map((skill, index) => (
            <span
              key={index}
              className="bg-slate-100 text-slate-700 text-xs font-medium px-3 py-1.5 rounded-full border border-slate-200"
            >
              {skill}
            </span>
          ))}
          {(job.skills || []).length > 4 && (
            <span className="bg-slate-200 text-slate-600 text-xs font-medium px-3 py-1.5 rounded-full border border-slate-300">
              +{(job.skills || []).length - 4} more
            </span>
          )}
        </div>

        {/* Action Buttons */}
        <div className="pt-4 border-t border-slate-100">
          <div className="flex flex-wrap gap-2 justify-start">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onViewDetails(job)}
              className="h-9 border-blue-200 text-blue-700 hover:bg-blue-50 hover:border-blue-300 flex items-center gap-1.5 font-medium text-xs"
            >
              <Eye className="w-4 h-4" />
              <span className="hidden sm:inline">View</span>
            </Button>

            <Button
              variant="outline"
              size="sm"
              onClick={() => onEditJob(job)}
              className="h-9 border-slate-200 text-slate-700 hover:bg-slate-50 hover:border-slate-300 flex items-center gap-1.5 font-medium text-xs"
            >
              <Edit className="w-4 h-4" />
              <span className="hidden sm:inline">Edit</span>
            </Button>

            <Button
              variant="outline"
              size="sm"
              onClick={() => onCreateJobPost(job)}
              className="h-9 border-green-200 text-green-700 hover:bg-green-50 hover:border-green-300 flex items-center gap-1.5 font-medium text-xs"
            >
              <FileText className="w-4 h-4" />
              <span className="hidden sm:inline">Create Post</span>
            </Button>

            <Button
              variant="outline"
              size="sm"
              onClick={() => onUploadResumes(job.id || '')}
              className="h-9 border-purple-200 text-purple-700 hover:bg-purple-50 hover:border-purple-300 flex items-center gap-1.5 font-medium text-xs"
            >
              <Upload className="w-4 h-4" />
              <span className="hidden sm:inline">Upload</span>
            </Button>

            <Button
              variant="outline"
              size="sm"
              onClick={() => onViewMatched(job.id || '')}
              className="h-9 border-orange-200 text-orange-700 hover:bg-orange-50 hover:border-orange-300 flex items-center gap-1.5 font-medium text-xs"
            >
              <Users className="w-4 h-4" />
              <span className="hidden sm:inline">Matches</span>
            </Button>

            <Button
              variant="outline"
              size="sm"
              onClick={() => onDeleteJob(job)}
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
