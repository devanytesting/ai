import React, { useState, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../hooks/redux';
import { updateJobPost, clearError } from '../../features/jobPosts/jobPostsSlice';
import { JobPost, UpdateJobPostData } from '../../features/jobPosts/jobPostsSlice';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '../ui/dialog';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { toast } from 'sonner';

interface UpdateJobPostModalProps {
  isOpen: boolean;
  onClose: () => void;
  jobPost: JobPost | null;
}

export const UpdateJobPostModal: React.FC<UpdateJobPostModalProps> = ({
  isOpen,
  onClose,
  jobPost,
}) => {
  const dispatch = useAppDispatch();
  const { isLoading, error } = useAppSelector((state) => state.jobPosts);

  const [formData, setFormData] = useState<UpdateJobPostData>({
    title: '',
    description: '',
    location: '',
    experience_required: 0,
    skills_required: [],
    salary_range_min: 0,
    salary_range_max: 0,
    employment_type: '',
    status: '',
  });

  const [skillsInput, setSkillsInput] = useState('');

  useEffect(() => {
    if (jobPost) {
      setFormData({
        title: jobPost.title,
        description: jobPost.description,
        location: jobPost.location,
        experience_required: jobPost.experience_required,
        skills_required: jobPost.skills_required,
        salary_range_min: jobPost.salary_range_min,
        salary_range_max: jobPost.salary_range_max,
        employment_type: jobPost.employment_type,
        status: jobPost.status,
      });
      setSkillsInput(jobPost.skills_required.join(', '));
    }
  }, [jobPost]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!jobPost) return;

    // Convert skills string to array
    const skillsArray = skillsInput
      .split(',')
      .map(skill => skill.trim())
      .filter(skill => skill.length > 0);

    const updatedData: UpdateJobPostData = {
      ...formData,
      skills_required: skillsArray,
    };

    try {
      await dispatch(updateJobPost({ 
        jobPostId: jobPost.id, 
        jobPostData: updatedData 
      })).unwrap();
      
      toast.success('Job post updated successfully!', {
        description: 'The job post has been updated with your changes.',
      });
      onClose();
    } catch (error) {
      toast.error('Failed to update job post', {
        description: error as string,
      });
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name.includes('salary') || name === 'experience_required' ? Number(value) : value,
    }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleClose = () => {
    dispatch(clearError());
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] flex flex-col">
        <DialogHeader className="flex-shrink-0">
          <DialogTitle>Update Job Post</DialogTitle>
        </DialogHeader>
        
        <div className="flex-1 overflow-y-auto pr-2">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="title">Job Title</Label>
                <Input
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  placeholder="Enter job title"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="location">Location</Label>
                <Input
                  id="location"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  placeholder="Enter location"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="experience_required">Experience Required (years)</Label>
                <Input
                  id="experience_required"
                  name="experience_required"
                  type="number"
                  min="0"
                  value={formData.experience_required}
                  onChange={handleChange}
                  placeholder="Enter years of experience"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="employment_type">Employment Type</Label>
                <Select
                  value={formData.employment_type}
                  onValueChange={(value) => handleSelectChange('employment_type', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select employment type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Full-time">Full-time</SelectItem>
                    <SelectItem value="Part-time">Part-time</SelectItem>
                    <SelectItem value="Contract">Contract</SelectItem>
                    <SelectItem value="Freelance">Freelance</SelectItem>
                    <SelectItem value="Internship">Internship</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="salary_range_min">Minimum Salary</Label>
                <Input
                  id="salary_range_min"
                  name="salary_range_min"
                  type="number"
                  min="0"
                  value={formData.salary_range_min}
                  onChange={handleChange}
                  placeholder="Enter minimum salary"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="salary_range_max">Maximum Salary</Label>
                <Input
                  id="salary_range_max"
                  name="salary_range_max"
                  type="number"
                  min="0"
                  value={formData.salary_range_max}
                  onChange={handleChange}
                  placeholder="Enter maximum salary"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Select
                  value={formData.status}
                  onValueChange={(value) => handleSelectChange('status', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="draft">Draft</SelectItem>
                    <SelectItem value="published">Published</SelectItem>
                    <SelectItem value="expired">Expired</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="skills_required">Skills Required</Label>
              <Input
                id="skills_required"
                value={skillsInput}
                onChange={(e) => setSkillsInput(e.target.value)}
                placeholder="Enter skills separated by commas (e.g., React, TypeScript, Node.js)"
              />
              <p className="text-sm text-muted-foreground">
                Separate multiple skills with commas
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Job Description</Label>
              <Textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Enter detailed job description"
                rows={6}
                required
              />
            </div>

            <div className="flex justify-end space-x-2 pt-4">
              <Button type="button" variant="outline" onClick={handleClose}>
                Cancel
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? 'Updating...' : 'Update Job Post'}
              </Button>
            </div>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
};
