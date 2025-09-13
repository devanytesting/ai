import React, { useState } from 'react';
import { Sidebar } from './Sidebar';
import { cn } from '@/lib/utils';

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const handleToggle = () => {
    setIsCollapsed(!isCollapsed);
  };

  const handleMobileClose = () => {
    setIsMobileOpen(false);
  };

  const handleMobileToggle = () => {
    setIsMobileOpen(!isMobileOpen);
  };

  return (
    <div className="min-h-screen bg-background">
      <Sidebar 
        isCollapsed={isCollapsed}
        onToggle={handleToggle}
        isMobileOpen={isMobileOpen}
        onMobileClose={handleMobileClose}
      />
      
      <main 
        className={cn(
          "transition-all duration-300 ease-in-out",
          isCollapsed ? "lg:ml-16" : "lg:ml-64"
        )}
      >
        {React.cloneElement(children as React.ReactElement, {
          onMobileToggle: handleMobileToggle,
          isCollapsed
        })}
      </main>
    </div>
  );
};
