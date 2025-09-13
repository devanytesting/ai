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
  Menu,
} from "lucide-react";
import { Button } from "../ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "../ui/tooltip";
import { cn } from "@/lib/utils";

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
  onMobileClose 
}) => {
  const isAuthenticated = true; // Replace with auth state
  const user = { name: "John Doe", email: "john@example.com" };
  const [activeItem, setActiveItem] = useState("Dashboard");

  const menuItems = [
    { icon: BarChart3, label: "Dashboard", id: "Dashboard" },
    { icon: Briefcase, label: "Job Posts", id: "Job Posts" },
    { icon: FileText, label: "Resumes", id: "Resumes" },
    { icon: Users, label: "Candidates", id: "Candidates" },
    { icon: Calendar, label: "Interviews", id: "Interviews" },
    { icon: Bell, label: "Notifications", id: "Notifications" },
  ];

  const sidebarWidth = isCollapsed ? "w-16" : "w-64";

  return (
    <TooltipProvider>
      {/* Mobile overlay */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={onMobileClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed left-0 top-0 h-full bg-gradient-to-b from-slate-900 to-slate-800 border-r border-slate-700 flex flex-col z-50 transition-all duration-300 ease-in-out",
          sidebarWidth,
          isMobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        )}
      >
        {/* Header with Logo and Toggle */}
        <div className="p-4 border-b border-slate-700">
          <div className="flex items-center justify-between">
            {!isCollapsed && (
              <h1 className="font-bold text-xl text-white">RecruitPro</h1>
            )}
            <Button
              variant="ghost"
              size="sm"
              onClick={onToggle}
              className="text-slate-300 hover:text-white hover:bg-slate-700 p-2 h-8 w-8"
            >
              {isCollapsed ? (
                <ChevronRight className="w-4 h-4" />
              ) : (
                <ChevronLeft className="w-4 h-4" />
              )}
            </Button>
          </div>
        </div>

        {/* Navigation Menu */}
        <nav className="flex-1 p-3 space-y-2">
          {menuItems.map((item) => {
            const button = (
              <Button
                key={item.id}
                variant="ghost"
                onClick={() => setActiveItem(item.id)}
                className={cn(
                  "w-full justify-start h-11 transition-all duration-200 group",
                  isCollapsed ? "px-2" : "px-3",
                  activeItem === item.id
                    ? "bg-blue-600 text-white shadow-lg shadow-blue-600/25"
                    : "text-slate-300 hover:text-white hover:bg-slate-700/50"
                )}
              >
                <item.icon 
                  className={cn(
                    "transition-colors duration-200",
                    isCollapsed ? "w-5 h-5" : "w-5 h-5 mr-3",
                    activeItem === item.id ? "text-white" : "text-slate-400 group-hover:text-white"
                  )} 
                />
                {!isCollapsed && (
                  <span className="font-medium">{item.label}</span>
                )}
              </Button>
            );

            return isCollapsed ? (
              <Tooltip key={item.id} delayDuration={300}>
                <TooltipTrigger asChild>
                  {button}
                </TooltipTrigger>
                <TooltipContent side="right" className="bg-slate-800 text-white border-slate-700">
                  <p>{item.label}</p>
                </TooltipContent>
              </Tooltip>
            ) : button;
          })}
        </nav>

        {/* User Section */}
        <div className="p-3 border-t border-slate-700">
          {isAuthenticated ? (
            <div className="space-y-2">
              {!isCollapsed ? (
                <div className="flex items-center space-x-3 p-2 rounded-lg bg-slate-700/50">
                  <Avatar className="w-8 h-8">
                    <AvatarImage src="" alt={user.name} />
                    <AvatarFallback className="bg-blue-600 text-white text-sm font-semibold">
                      {user.name.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-white truncate">{user.name}</p>
                    <p className="text-xs text-slate-400 truncate">{user.email}</p>
                  </div>
                </div>
              ) : (
                <div className="flex justify-center">
                  <Avatar className="w-8 h-8">
                    <AvatarImage src="" alt={user.name} />
                    <AvatarFallback className="bg-blue-600 text-white text-sm font-semibold">
                      {user.name.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                </div>
              )}
              <Button
                variant="ghost"
                className={cn(
                  "w-full justify-start text-red-400 hover:text-red-300 hover:bg-red-900/20 transition-all duration-200",
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
                "w-full bg-blue-600 hover:bg-blue-700 text-white transition-all duration-200",
                isCollapsed ? "px-2" : "px-3"
              )}
              variant="default"
            >
              <LogIn className={cn("w-4 h-4", !isCollapsed && "mr-3")} />
              {!isCollapsed && <span>Login / Sign Up</span>}
            </Button>
          )}
        </div>
      </aside>
    </TooltipProvider>
  );
};
