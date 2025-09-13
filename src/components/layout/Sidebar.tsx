import React from 'react';
import { Users, Briefcase, FileText, Settings, LogOut } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '../../hooks/redux';
import { signOut } from '../../features/auth/authSlice';
import { Button } from '../ui/button';

export const Sidebar: React.FC = () => {
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);

  const handleSignOut = () => {
    dispatch(signOut());
  };

  const menuItems = [
    { icon: Briefcase, label: 'Dashboard', active: true },
    { icon: FileText, label: 'Job Posts', active: false },
    { icon: Users, label: 'Resumes', active: false },
    { icon: Settings, label: 'Settings', active: false },
  ];

  return (
    <aside className="sidebar-nav flex flex-col">
      {/* Header */}
      <div className="p-6 border-b border-sidebar-border">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-primary rounded-md flex items-center justify-center">
            <Users className="w-5 h-5 text-primary-foreground" />
          </div>
          <div>
            <h1 className="font-bold text-lg text-sidebar-foreground">RecruitPro</h1>
            <p className="text-muted-foreground text-xs">Resume Dashboard</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex-1 p-4">
        <nav className="space-y-1">
          {menuItems.map((item, index) => (
            <Button
              key={index}
              variant={item.active ? "default" : "ghost"}
              className={`nav-item ${item.active ? 'active' : ''}`}
            >
              <item.icon className="w-4 h-4 mr-3" />
              <span className="text-sm font-medium">{item.label}</span>
            </Button>
          ))}
        </nav>
      </div>

      {/* User Profile & Sign Out */}
      <div className="p-4 border-t border-sidebar-border bg-sidebar-accent/30">
        <div className="flex items-center space-x-3 mb-3">
          <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
            <span className="text-xs font-semibold text-primary-foreground">
              {user?.name?.charAt(0).toUpperCase() || 'U'}
            </span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-medium text-sm truncate text-sidebar-foreground">
              {user?.name || 'User'}
            </p>
            <p className="text-muted-foreground text-xs truncate">
              {user?.email || 'user@example.com'}
            </p>
          </div>
        </div>
        
        <Button
          variant="ghost"
          size="sm"
          onClick={handleSignOut}
          className="w-full justify-start text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
        >
          <LogOut className="w-4 h-4 mr-2" />
          <span className="text-sm">Sign Out</span>
        </Button>
      </div>
    </aside>
  );
};