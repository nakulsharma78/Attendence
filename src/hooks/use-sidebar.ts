
'use client';
import { useContext } from 'react';
import { SidebarContext } from '@/components/ui/sidebar';

export function useSidebar() {
  const context = useContext(SidebarContext);
  
  if (context === undefined) {
    // This is a normal case when the component is not inside a SidebarProvider
    // We return a default state instead of throwing an error.
    return {
      isInsideSidebar: false,
      state: 'collapsed',
      open: false,
      setOpen: () => {},
      isMobile: false,
      openMobile: false,
      setOpenMobile: () => {},
      toggleSidebar: () => {},
    };
  }
  
  return { ...context, isInsideSidebar: true };
}
