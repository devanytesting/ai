// Modal: create a new job requisition with skills capture
import React, { useState } from 'react';
import { X } from 'lucide-react';
import { useAppDispatch } from '../../hooks/redux';
import { createJob } from '../../features/jobs/jobsSlice';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Badge } from '../ui/badge';
import { Textarea } from '../ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { toast } from 'sonner';

/**
 * Props for AddJobModal
 * - isOpen: show/hide dialog
 * - onClose: close handler (also resets form)
 */
interface AddJobModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AddJobModal: React.FC<AddJobModalProps> = ({ isOpen, onClose }) => {
  const dispatch = useAppDispatch();

  // Local form state for job fields
  const [formData, setFormData] = useState({
    title: '',
    department: '',
    location: '',
    experience_required: '',
    salary_range_min: '',
    salary_range_max: '',
    employment_type: 'Full-time',
    responsibilities: '',
    qualifications: '',
  });

  const [skills, setSkills] = useState<string[]>([]);
  const [skillInput, setSkillInput] = useState('');

  // Handle field changes
  // Update text/number fields with basic validation
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;

    // Prevent negative numbers for numeric fields
    const numericFields = ['experience_required', 'salary_range_min', 'salary_range_max'];
    if (numericFields.includes(name)) {
      const numValue = parseFloat(value);
      if (value === '' || (!isNaN(numValue) && numValue >= 0)) {
        setFormData(prev => ({ ...prev, [name]: value }));
      }
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  // Handle Enter key for skills
  // Add a skill on Enter; prevents duplicates
  const handleSkillKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && skillInput.trim()) {
      e.preventDefault();
      if (!skills.includes(skillInput.trim())) {
        setSkills(prev => [...prev, skillInput.trim()]);
      }
      setSkillInput('');
    }
  };

  // Remove a skill pill
  const removeSkill = (skillToRemove: string) => {
    setSkills(prev => prev.filter(skill => skill !== skillToRemove));
  };

  // Submit: validate and dispatch createJob
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Basic validation
    const requiredFields = ['title', 'department', 'location', 'experience_required', 'responsibilities', 'qualifications'];
    for (const field of requiredFields) {
      if (!formData[field as keyof typeof formData]) {
        alert(`Please fill the ${field.replace('_', ' ')} field.`);
        return;
      }
    }

    if (skills.length === 0) {
      alert('Please add at least one skill.');
      return;
    }

    const jobData = {
      title: formData.title,
      department: formData.department,
      location: formData.location,
      experience_required: parseFloat(formData.experience_required),
      skills_required: skills,
      responsibilities: formData.responsibilities,
      qualifications: formData.qualifications,
      salary_range_min: parseFloat(formData.salary_range_min) || 0,
      salary_range_max: parseFloat(formData.salary_range_max) || 0,
      employment_type: formData.employment_type,
    };

    try {
      await dispatch(createJob(jobData)).unwrap();
      toast.success('Job requisition created successfully!', {
        description: `"${formData.title}" has been added to your job requisitions.`,
      });
      onClose();
      resetForm();
    } catch (error) {
      toast.error('Failed to create job requisition', {
        description: error as string || 'Please check your information and try again.',
      });
      console.error('Failed to create job:', error);
    }
  };

  // Reset all local state values
  const resetForm = () => {
    setFormData({
      title: '',
      department: '',
      location: '',
      experience_required: '',
      salary_range_min: '',
      salary_range_max: '',
      employment_type: 'Full-time',
      responsibilities: '',
      qualifications: '',
    });
    setSkills([]);
    setSkillInput('');
  };

  // Close dialog and reset form data
  const handleClose = () => {
    onClose();
    resetForm();
  };

  const inputClasses = "border border-gray-300 focus:outline-none";

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] flex flex-col">
        <DialogHeader className="flex-shrink-0">
          <DialogTitle className="flex items-center justify-between">
            <span>Add New Job Post</span>
           
          </DialogTitle>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto pr-2">
          <form onSubmit={handleSubmit} className="space-y-6">
          {/* Job Title */}
          <div className="space-y-2">
            <Label htmlFor="title">Job Title</Label>
            <Input
              id="title"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              placeholder="e.g., Senior Frontend Developer"
              required
              className={inputClasses}
            />
          </div>

          {/* Department */}
          <div className="space-y-2">
            <Label htmlFor="department">Department</Label>
            <Input
              id="department"
              name="department"
              value={formData.department}
              onChange={handleInputChange}
              placeholder="e.g., Engineering"
              required
              className={inputClasses}
            />
          </div>

          {/* Experience & Location */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="experience_required">Experience (Years)</Label>
              <Input
                id="experience_required"
                name="experience_required"
                type="number"
                min="0"
                step="0.5"
                value={formData.experience_required}
                onChange={handleInputChange}
                placeholder="e.g., 3"
                required
                className={inputClasses}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="location">Location</Label>
              <Input
                id="location"
                name="location"
                value={formData.location}
                onChange={handleInputChange}
                placeholder="e.g., San Francisco, CA"
                required
                className={inputClasses}
              />
            </div>
          </div>

          {/* Skills */}
          <div className="space-y-2">
            <Label htmlFor="skills">Skills</Label>
            <Input
              id="skills"
              value={skillInput}
              onChange={(e) => setSkillInput(e.target.value)}
              onKeyPress={handleSkillKeyPress}
              placeholder="Type a skill and press Enter"
              className={inputClasses}
            />
            {skills.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {skills.map((skill, index) => (
                  <Badge key={index} variant="secondary" className="flex items-center gap-1">
                    {skill}
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removeSkill(skill)}
                      className="h-auto p-0 hover:bg-transparent"
                    >
                      <X className="w-3 h-3" />
                    </Button>
                  </Badge>
                ))}
              </div>
            )}
          </div>

          {/* Responsibilities */}
          <div className="space-y-2">
            <Label htmlFor="responsibilities">Responsibilities</Label>
            <Textarea
              id="responsibilities"
              name="responsibilities"
              value={formData.responsibilities}
              onChange={handleInputChange}
              placeholder="Describe the job responsibilities"
              required
              className={inputClasses}
            />
          </div>

          {/* Qualifications */}
          <div className="space-y-2">
            <Label htmlFor="qualifications">Qualifications</Label>
            <Textarea
              id="qualifications"
              name="qualifications"
              value={formData.qualifications}
              onChange={handleInputChange}
              placeholder="Required qualifications"
              required
              className={inputClasses}
            />
          </div>

          {/* Salary Range & Employment Type */}
          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="salary_range_min">Min Salary</Label>
              <Input
                id="salary_range_min"
                name="salary_range_min"
                type="number"
                min="0"
                value={formData.salary_range_min}
                onChange={handleInputChange}
                placeholder="0"
                className={inputClasses}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="salary_range_max">Max Salary</Label>
              <Input
                id="salary_range_max"
                name="salary_range_max"
                type="number"
                min="0"
                value={formData.salary_range_max}
                onChange={handleInputChange}
                placeholder="0"
                className={inputClasses}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="employment_type">Employment Type</Label>
              <Select
                value={formData.employment_type}
                onValueChange={(value) => setFormData(prev => ({ ...prev, employment_type: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Full-time">Full-time</SelectItem>
                  <SelectItem value="Part-time">Part-time</SelectItem>
                  <SelectItem value="Contract">Contract</SelectItem>
                  <SelectItem value="Internship">Internship</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Buttons */}
          <div className="flex justify-end space-x-3 pt-4 border-t border-border">
            <Button type="button" variant="outline" onClick={handleClose}>
              Cancel
            </Button>
            <Button type="submit">
              Create Job Post
            </Button>
          </div>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
};
