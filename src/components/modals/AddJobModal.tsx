import React, { useState } from 'react';
import { X } from 'lucide-react';
import { useAppDispatch } from '../../hooks/redux';
import { createJob } from '../../features/jobs/jobsSlice';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Badge } from '../ui/badge';

interface AddJobModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AddJobModal: React.FC<AddJobModalProps> = ({ isOpen, onClose }) => {
  const dispatch = useAppDispatch();
  
  const [formData, setFormData] = useState({
    title: '',
    experience: '',
    location: '',
  });
  
  const [skills, setSkills] = useState<string[]>([]);
  const [skillInput, setSkillInput] = useState('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    
    if (name === 'experience') {
      const numValue = parseFloat(value);
      if (value === '' || (numValue >= 0 && !isNaN(numValue))) {
        setFormData(prev => ({ ...prev, [name]: value }));
      }
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSkillKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && skillInput.trim()) {
      e.preventDefault();
      if (!skills.includes(skillInput.trim())) {
        setSkills(prev => [...prev, skillInput.trim()]);
      }
      setSkillInput('');
    }
  };

  const removeSkill = (skillToRemove: string) => {
    setSkills(prev => prev.filter(skill => skill !== skillToRemove));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title || !formData.location || !formData.experience) {
      return;
    }

    const jobData = {
      ...formData,
      experience: parseInt(formData.experience),
      skills,
    };

    try {
      await dispatch(createJob(jobData));
      onClose();
      resetForm();
    } catch (error) {
      console.error('Failed to create job:', error);
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      experience: '',
      location: '',
    });
    setSkills([]);
    setSkillInput('');
  };

  const handleClose = () => {
    onClose();
    resetForm();
  };

  const inputClasses = "border border-gray-300 focus:outline-none";

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span>Add New Job Post</span>
          </DialogTitle>
        </DialogHeader>

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

          {/* Experience & Location */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="experience">Experience (Years)</Label>
              <Input
                id="experience"
                name="experience"
                type="number"
                min="0"
                step="0.5"
                value={formData.experience}
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
      </DialogContent>
    </Dialog>
  );
};
