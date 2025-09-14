import React, { useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../hooks/redux';
import { signIn, clearError } from '../../features/auth/authSlice';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Card, CardHeader, CardContent, CardTitle } from '../ui/card';
import { Alert, AlertDescription } from '../ui/alert';
import { toast } from 'sonner';

interface SignInFormProps {
  onToggleMode: () => void;
}

export const SignInForm: React.FC<SignInFormProps> = ({ onToggleMode }) => {
  const dispatch = useAppDispatch();
  const { isLoading, error } = useAppSelector((state) => state.auth);
  
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(clearError());
    
    try {
      await dispatch(signIn(formData)).unwrap();
      toast.success('Welcome back!', {
        description: 'You have successfully signed in to your account.',
      });
    } catch (error) {
      toast.error('Sign in failed', {
        description: error as string || 'Please check your credentials and try again.',
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
        <CardTitle className="text-2xl font-bold">Sign In</CardTitle>
        <p className="text-muted-foreground">Access your recruitment dashboard</p>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          
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
            {isLoading ? 'Signing In...' : 'Sign In'}
          </Button>
          
          <div className="text-center">
            <Button 
              type="button" 
              variant="link" 
              onClick={onToggleMode}
              className="text-accent"
            >
              Don't have an account? Sign up
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};