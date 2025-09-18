// Sidebar component: navigation + user section with collapse support
import React, { useState } from "react";
import {
  Users,
  Briefcase,
  FileText,
  BarChart3,
  Calendar,
  Bell,
  LogOut,
  LogIn,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { Button } from "../ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "../ui/tooltip";
import { cn } from "@/lib/utils";
import { useAppDispatch, useAppSelector } from '../../hooks/redux';
import { signOut, clearError } from '../../features/auth/authSlice';
import { useNavigate } from "react-router-dom";
import { toast } from 'sonner';


// Props control collapsed state and mobile visibility
interface SidebarProps {
  isCollapsed?: boolean;
  onToggle?: () => void;
  isMobileOpen?: boolean;
  onMobileClose?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  isCollapsed = false,
  onToggle,
  isMobileOpen = false,
  onMobileClose,
}) => {
  // Auth state from Redux store
  const { isAuthenticated, user } = useAppSelector((state) => state.auth);
  // Track which menu item is currently active (local UI state)
  const [activeItem, setActiveItem] = useState("Dashboard");

  // Define sidebar navigation items and their icons
  const menuItems = [
    { icon: BarChart3, label: "Dashboard", id: "Dashboard" },
    { icon: Briefcase, label: "Job Posts", id: "Job Posts" },
    { icon: FileText, label: "Resumes", id: "Resumes" },
    { icon: Users, label: "Candidates", id: "Candidates" },
    { icon: Calendar, label: "Interviews", id: "Interviews" },
    { icon: Bell, label: "Notifications", id: "Notifications" },
  ];

  const dispatch = useAppDispatch();
  const navigate = useNavigate();

    // Handle sign-out by dispatching auth action and navigating to auth page
    const handleLogout = async () => {
      try {
        await dispatch(signOut()).unwrap();
        toast.success('Signed out successfully!', {
          description: 'You have been logged out of your account.',
        });
        navigate("/auth"); // redirect to login/auth page
      } catch (error) {
        toast.error('Logout failed', {
          description: 'There was an error signing you out. Please try again.',
        });
        console.error("Logout failed:", error);
      }
    };

  // Compute width utility class based on collapsed state
  const sidebarWidth = isCollapsed ? "w-16" : "w-64";

  return (
    <TooltipProvider>
      {/* Mobile overlay: click to close when sidebar is open on small screens */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 bg-black/10 z-40 lg:hidden"
          onClick={onMobileClose}
        />
      )}

      {/* Sidebar container */}
      <aside
        className={cn(
          "fixed left-0 top-0 h-full bg-white border-r border-slate-200 flex flex-col z-50 transition-all duration-300 ease-in-out shadow-lg",
          sidebarWidth,
          isMobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        )}
      >
        {/* Header: brand + collapse toggle */}
        <div className="p-4 border-b border-slate-200 flex items-center justify-between bg-gradient-to-r from-blue-600 to-indigo-600">
          {!isCollapsed && <h1 className="font-bold text-xl text-white">RecruitPro</h1>}
          <Button
            variant="ghost"
            size="sm"
            onClick={onToggle}
            className="text-white hover:bg-white/20 hover:text-white p-2 h-8 w-8 transition-all duration-200 rounded-lg"
          >
            {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </Button>
        </div>

        {/* Navigation menu: list of routes */}
        <nav className="flex-1 p-3 space-y-2">
          {menuItems.map((item) => {
            const button = (
              <Button
                key={item.id}
                variant="ghost"
                onClick={() => setActiveItem(item.id)}
                className={cn(
                  "w-full justify-start h-11 transition-all duration-200 group rounded-lg",
                  isCollapsed ? "px-2" : "px-3",
                  activeItem === item.id
                    ? "bg-blue-50 text-blue-700 border border-blue-200 hover:bg-blue-100 hover:text-blue-800"
                    : "text-slate-700 hover:bg-slate-50 hover:text-slate-900"
                )}
              >
                <item.icon
                  className={cn(
                    "transition-colors duration-200",
                    isCollapsed ? "w-5 h-5" : "w-5 h-5 mr-3",
                    activeItem === item.id ? "text-blue-600" : "text-slate-500 group-hover:text-slate-700"
                  )}
                />
                {!isCollapsed && <span className="font-medium">{item.label}</span>}
              </Button>
            );

            return isCollapsed ? (
              <Tooltip key={item.id} delayDuration={300}>
                <TooltipTrigger asChild>{button}</TooltipTrigger>
                <TooltipContent side="right" className="bg-white text-slate-900 border border-slate-200 shadow-lg">
                  <p>{item.label}</p>
                </TooltipContent>
              </Tooltip>
            ) : (
              button
            );
          })}
        </nav>

        {/* User section: shows profile and sign out if authenticated, else sign in CTA */}
        <div className="p-3 border-t border-slate-200 bg-slate-50">
          {isAuthenticated ? (
            <div className="space-y-2">
              {!isCollapsed ? (
                <div className="flex items-center space-x-3 p-2 rounded-lg bg-white border border-slate-200">
                  <Avatar className="w-8 h-8">
                    <AvatarImage src="" alt={user?.name || 'User'} />
                    <AvatarFallback className="bg-blue-600 text-white text-sm font-semibold">
                      {(user?.name || 'User').charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-slate-900 truncate">{user?.name || 'User'}</p>
                    <p className="text-xs text-slate-600 truncate">{user?.email || 'user@example.com'}</p>
                  </div>
                </div>
              ) : (
                <div className="flex justify-center">
                  <Avatar className="w-8 h-8">
                    <AvatarImage src="" alt={user?.name || 'User'} />
                    <AvatarFallback className="bg-blue-600 text-white text-sm font-semibold">
                      {(user?.name || 'User').charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                </div>
              )}
              <Button
                variant="ghost"
                onClick={handleLogout}
                className={cn(
                  "w-full justify-start text-slate-700 hover:text-red-700 hover:bg-red-50 transition-all duration-200 rounded-lg",
                  isCollapsed ? "px-2" : "px-3"
                )}
              >
                <LogOut className={cn("w-4 h-4", !isCollapsed && "mr-3")} />
                {!isCollapsed && <span>Sign Out</span>}
              </Button>
            </div>
          ) : (
            <Button
              className={cn(
                "w-full bg-blue-600 text-white hover:bg-blue-700 hover:shadow-lg transition-all duration-200 rounded-lg transform hover:scale-105",
                isCollapsed ? "px-2" : "px-3"
              )}
              variant="default"
              onClick={handleLogout}
            >
              <LogIn className={cn("w-4 h-4", !isCollapsed && "mr-3")} />
              {!isCollapsed && <span>Sign In</span>}
            </Button>
          )}
        </div>
      </aside>
    </TooltipProvider>
  );
};
