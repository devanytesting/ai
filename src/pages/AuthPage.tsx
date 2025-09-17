import React, { useState } from 'react';
import { SignInForm } from '../components/auth/SignInForm';
import { SignUpForm } from '../components/auth/SignUpForm';

export const AuthPage: React.FC = () => {
  const [isSignUp, setIsSignUp] = useState(false);

  const toggleMode = () => {
    setIsSignUp(!isSignUp);
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-white to-blue-50" />
      <div className="absolute -top-20 -left-20 h-72 w-72 rounded-full bg-blue-200/40 blur-3xl" />
      <div className="absolute -bottom-20 -right-20 h-72 w-72 rounded-full bg-blue-300/40 blur-3xl" />

      <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 min-h-screen">
        <div className="hidden md:flex items-center justify-center p-10 bg-white/60 backdrop-blur-sm">
          <div className="max-w-md text-center space-y-6">
            <img
              src="https://images.unsplash.com/photo-1556761175-4b46a572b786?auto=format&fit=crop&w=1600&q=80"
              alt="HR team collaborating during recruitment process"
              className="w-full rounded-xl shadow object-cover"
            />
            <div>
              <h2 className="text-2xl font-bold text-blue-700">Smarter Hiring for HR Teams</h2>
              <p className="text-muted-foreground">Analyze resumes, match candidates, and streamline your recruitment pipeline.</p>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-center p-6">
          <div className="w-full max-w-md">
            {isSignUp ? (
              <SignUpForm onToggleMode={toggleMode} />
            ) : (
              <SignInForm onToggleMode={toggleMode} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};