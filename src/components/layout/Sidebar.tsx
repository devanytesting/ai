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
  const isAuthenticated = false;
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

  const dispatch = useAppDispatch();
  const navigate = useNavigate();

    // Logout function
    const handleLogout = async () => {
      try {
        await dispatch(signOut());
        navigate("/auth"); // redirect to login/auth page
      } catch (error) {
        console.error("Logout failed:", error);
      }
    };

  const sidebarWidth = isCollapsed ? "w-16" : "w-64";

  return (
    <TooltipProvider>
      {/* Mobile overlay */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 bg-black/10 z-40 lg:hidden"
          onClick={onMobileClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed left-0 top-0 h-full bg-white border-r border-black/20 flex flex-col z-50 transition-all duration-300 ease-in-out",
          sidebarWidth,
          isMobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        )}
      >
        {/* Header */}
        <div className="p-4 border-b border-black/20 flex items-center justify-between">
          {!isCollapsed && <h1 className="font-bold text-xl text-black">RecruitPro</h1>}
          <Button
            variant="ghost"
            size="sm"
            onClick={onToggle}
            className="text-black hover:bg-black/10 p-2 h-8 w-8"
          >
            {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </Button>
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
                    ? "bg-black text-white"
                    : "text-black hover:bg-black/10 hover:text-black"
                )}
              >
                <item.icon
                  className={cn(
                    "transition-colors duration-200",
                    isCollapsed ? "w-5 h-5" : "w-5 h-5 mr-3",
                    activeItem === item.id ? "text-white" : "text-black group-hover:text-black"
                  )}
                />
                {!isCollapsed && <span className="font-medium">{item.label}</span>}
              </Button>
            );

            return isCollapsed ? (
              <Tooltip key={item.id} delayDuration={300}>
                <TooltipTrigger asChild>{button}</TooltipTrigger>
                <TooltipContent side="right" className="bg-white text-black border border-black/20">
                  <p>{item.label}</p>
                </TooltipContent>
              </Tooltip>
            ) : (
              button
            );
          })}
        </nav>

        {/* User Section */}
        <div className="p-3 border-t border-black/20">
          {isAuthenticated ? (
            <div className="space-y-2">
              {!isCollapsed ? (
                <div className="flex items-center space-x-3 p-2 rounded-lg bg-black/5">
                  <Avatar className="w-8 h-8">
                    <AvatarImage src="" alt={user.name} />
                    <AvatarFallback className="bg-black text-white text-sm font-semibold">
                      {user.name.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-black truncate">{user.name}</p>
                    <p className="text-xs text-black/60 truncate">{user.email}</p>
                  </div>
                </div>
              ) : (
                <div className="flex justify-center">
                  <Avatar className="w-8 h-8">
                    <AvatarImage src="" alt={user.name} />
                    <AvatarFallback className="bg-black text-white text-sm font-semibold">
                      {user.name.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                </div>
              )}
              <Button
                variant="ghost"
                className={cn(
                  "w-full justify-start text-black/80 hover:text-black hover:bg-red-900/10 transition-all duration-200",
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
                "w-full bg-black text-white hover:bg-black/90 transition-all duration-200",
                isCollapsed ? "px-2" : "px-3"
              )}
              variant="default"
              onClick={handleLogout} // call logout on click
            >
              <LogIn className={cn("w-4 h-4", !isCollapsed && "mr-3")} />
              {!isCollapsed && <span>Logout</span>}
            </Button>
          )}
        </div>
      </aside>
    </TooltipProvider>
  );
};
