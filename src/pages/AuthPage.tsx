// Combined sign-in/sign-up page with marketing panel
import React, { useState } from 'react';
import { SignInForm } from '../components/auth/SignInForm';
import { SignUpForm } from '../components/auth/SignUpForm';
import { BrainCircuit, Briefcase, ShieldCheck, Users, Sparkles } from 'lucide-react';

export const AuthPage: React.FC = () => {
  // Toggle between sign-in and sign-up forms
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
        {/* Left: Auth form */}
        <div className="flex items-center justify-center p-6 order-2 md:order-1">
          <div className="w-full max-w-md">
            {isSignUp ? (
              <SignUpForm onToggleMode={toggleMode} />
            ) : (
              <SignInForm onToggleMode={toggleMode} />
            )}
          </div>
        </div>

        {/* Right: Product image with tagline and tags */}
        <div className="hidden md:flex items-center justify-center p-10 order-1 md:order-2">
          <div className="max-w-lg w-full">
            <div className="rounded-2xl overflow-hidden shadow-md border border-blue-100 bg-gradient-to-br from-blue-100/60 via-white to-blue-200/40">
              <div className="aspect-[4/3] w-full bg-gradient-to-br from-blue-100 via-white to-blue-200" />
              <div className="p-6">
                <h2 className="text-2xl font-bold text-blue-800">Smart AI Recruiter</h2>
                <p className="text-sm text-muted-foreground mt-1">Screen resumes, match candidates, and hire faster with intelligent automation.</p>

                <div className="mt-4 flex flex-wrap gap-2">
                  <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-blue-200 bg-blue-50 text-blue-700 text-xs">
                    <BrainCircuit className="h-4 w-4" /> AI Scoring
                  </span>
                  <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-blue-200 bg-blue-50 text-blue-700 text-xs">
                    <Briefcase className="h-4 w-4" /> JD Matching
                  </span>
                  <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-blue-200 bg-blue-50 text-blue-700 text-xs">
                    <ShieldCheck className="h-4 w-4" /> Secure
                  </span>
                  <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-blue-200 bg-blue-50 text-blue-700 text-xs">
                    <Users className="h-4 w-4" /> Team Ready
                  </span>
                  <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-blue-200 bg-blue-50 text-blue-700 text-xs">
                    <Sparkles className="h-4 w-4" /> Automation
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};