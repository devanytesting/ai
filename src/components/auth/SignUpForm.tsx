import React, { useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../hooks/redux';
import { signUp, clearError } from '../../features/auth/authSlice';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Card, CardHeader, CardContent, CardTitle } from '../ui/card';
import { Alert, AlertDescription } from '../ui/alert';
import { toast } from 'sonner';

interface SignUpFormProps {
  onToggleMode: () => void;
}

export const SignUpForm: React.FC<SignUpFormProps> = ({ onToggleMode }) => {
  const dispatch = useAppDispatch();
  const { isLoading, error } = useAppSelector((state) => state.auth);
  
  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    password: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    dispatch(clearError());
    
    try {
      await dispatch(signUp({
        name: formData.full_name,
        email: formData.email,
        password: formData.password,
      })).unwrap();
      
      toast.success('Account created successfully!', {
        description: 'Welcome to our recruitment platform. You can now start managing your job postings.',
      });
    } catch (error) {
      toast.error('Sign up failed', {
        description: error as string || 'Please check your information and try again.',
      });
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl font-bold">Create Account</CardTitle>
        <p className="text-muted-foreground">Join our recruitment platform</p>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          
          <div className="space-y-2">
            <Label htmlFor="full_name">Full Name</Label>
            <Input
              id="full_name"
              name="full_name"
              type="text"
              value={formData.full_name}
              onChange={handleChange}
              placeholder="Enter your full name"
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your email"
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter your password"
              required
            />
          </div>
          
          <Button 
            type="submit" 
            className="w-full" 
            disabled={isLoading}
          >
            {isLoading ? 'Creating Account...' : 'Create Account'}
          </Button>
          
          <div className="text-center">
            <Button 
              type="button" 
              variant="link" 
              onClick={onToggleMode}
              className="text-accent"
            >
              Already have an account? Sign in
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};
