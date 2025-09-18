import React, { useState } from 'react';
import { Sidebar } from './Sidebar';
import { cn } from '@/lib/utils';

/**
 * Page layout with persistent `Sidebar` and responsive content area.
 * - Manages collapse state for large screens and open state on mobile.
 * - Passes `onMobileToggle` to children to allow header/menu buttons to open the sidebar.
 */
interface LayoutProps {
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  // Whether the sidebar is collapsed on desktop
  const [isCollapsed, setIsCollapsed] = useState(false);
  // Whether the sidebar drawer is open on mobile
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  // Toggle collapsed width on large screens
  const handleToggle = () => {
    setIsCollapsed(!isCollapsed);
  };

  // Close the mobile drawer (e.g., when clicking overlay)
  const handleMobileClose = () => {
    setIsMobileOpen(false);
  };

  // Open/close the mobile drawer (triggered by header button)
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
