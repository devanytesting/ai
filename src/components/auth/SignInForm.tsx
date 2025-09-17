import React, { useState } from 'react';
import { useAppDispatch } from '../../hooks/redux';
import { signIn } from '../../features/auth/authSlice';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Card, CardHeader, CardContent, CardTitle } from '../ui/card';
import { Mail, Lock, LogIn, Shield, Globe, Eye, EyeOff } from 'lucide-react';
import { toast } from 'sonner';
import { Checkbox } from '../ui/checkbox';

interface SignInFormProps {
  onToggleMode: () => void;
}

export const SignInForm: React.FC<SignInFormProps> = ({ onToggleMode }) => {
  const dispatch = useAppDispatch();
  const isLoading = false; // Do not manage UI messages in Redux; keep UI decoupled
  
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
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
    <Card className="w-full max-w-md mx-auto overflow-hidden bg-white/90 backdrop-blur">
      <div className="h-28 bg-gradient-to-r from-blue-100 to-blue-300 flex items-center justify-center">
        <div className="h-12 w-12 rounded-full bg-white/80 flex items-center justify-center shadow">
          <Shield className="h-6 w-6 text-blue-600" />
        </div>
      </div>
      <CardHeader className="text-center">
        <CardTitle className="text-2xl font-bold flex items-center justify-center gap-2">
          <LogIn className="w-5 h-5 text-blue-600" />
          Sign In
        </CardTitle>
        <p className="text-muted-foreground">Access your recruitment dashboard</p>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <div className="relative">
              <Mail className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <Input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter your email"
                className="pl-9"
                required
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <div className="relative">
              <Lock className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <Input
                id="password"
                name="password"
                type={showPassword ? 'text' : 'password'}
                value={formData.password}
                onChange={handleChange}
                placeholder="Enter your password"
                className="pl-9 pr-9"
                required
              />
              <button
                type="button"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                onClick={() => setShowPassword((s) => !s)}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Checkbox id="remember" />
              <Label htmlFor="remember" className="text-sm text-muted-foreground">Remember me</Label>
            </div>
            <Button type="button" variant="link" className="text-sm px-0">Forgot password?</Button>
          </div>

          <Button 
            type="submit" 
            className="w-full" 
            disabled={isLoading}
          >
            {isLoading ? 'Signing In...' : 'Sign In'}
          </Button>

          <div className="flex items-center gap-3">
            <div className="h-px bg-border w-full" />
            <span className="text-xs text-muted-foreground">OR</span>
            <div className="h-px bg-border w-full" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Button type="button" variant="outline" className="justify-center hover:border-primary">
              <Globe className="w-4 h-4 mr-2 text-blue-600" />
              Continue with Google
            </Button>
            <Button type="button" variant="outline" className="justify-center hover:border-primary">
              <Shield className="w-4 h-4 mr-2 text-blue-600" />
              Continue with Microsoft
            </Button>
          </div>
          
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