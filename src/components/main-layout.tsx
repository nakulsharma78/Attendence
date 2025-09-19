'use client';

import * as React from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { BarChart3, LayoutDashboard, ShieldCheck, UserPlus, Settings, LogOut } from 'lucide-react';
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarFooter,
} from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';
import { useSession } from '@/components/session-provider';
import { logout } from '@/lib/auth-actions';
import Loading from '@/app/loading';

export function MainLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, isSubscribed, loading } = useSession();
  
  const publicPages = ['/', '/login', '/signup'];
  const isPublicPage = publicPages.includes(pathname) || pathname.startsWith('/#');

  React.useEffect(() => {
    if (loading) return;

    // If user is not logged in and not on a public page, redirect to login
    if (!user && !isPublicPage) {
      router.push('/login');
      return;
    }

    // If user is logged in but NOT subscribed, and trying to access a non-public page,
    // redirect them to the pricing page.
    if (user && !isSubscribed && !isPublicPage) {
      router.push('/#pricing');
      return;
    }

  }, [user, isSubscribed, loading, isPublicPage, router, pathname]);

  if (loading) {
    return <Loading />;
  }
  
  if (isPublicPage) {
     return <>{children}</>;
  }
  
  // If we are here, user is logged in AND subscribed
  if (!user) {
    // This can happen briefly during redirects, show a loading state
    return <Loading />;
  }

  const menuItems = [
    {
      href: '/dashboard',
      label: 'Dashboard',
      icon: LayoutDashboard,
    },
    {
      href: '/enrollment',
      label: 'Enrollment',
      icon: UserPlus,
    },
    {
      href: '/reports',
      label: 'Reports',
      icon: BarChart3,
    },
    {
      href: '/settings',
      label: 'Settings',
      icon: Settings,
    },
  ];

  return (
    <SidebarProvider>
      <Sidebar variant="inset" collapsible="icon">
        <SidebarHeader>
          <Button asChild variant="ghost" className="h-10 w-full justify-start px-2">
            <Link href="/dashboard">
              <ShieldCheck className="h-6 w-6 text-primary" />
              <span className="ml-2 font-bold text-lg">GuardianAI</span>
            </Link>
          </Button>
        </SidebarHeader>
        <SidebarContent>
          <SidebarMenu>
            {menuItems.map((item) => (
              <SidebarMenuItem key={item.label}>
                <SidebarMenuButton
                  asChild
                  isActive={pathname === item.href}
                  tooltip={item.label}
                  as={Link}
                  href={item.href}
                >
                  <>
                    <item.icon />
                    <span>{item.label}</span>
                  </>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarContent>
        <SidebarFooter>
           <SidebarMenu>
             <SidebarMenuItem>
                <form action={logout}>
                  <SidebarMenuButton asChild tooltip="Logout" className="w-full">
                    <button type="submit">
                      <LogOut />
                      <span>Logout</span>
                    </button>
                  </SidebarMenuButton>
                </form>
             </SidebarMenuItem>
           </SidebarMenu>
        </SidebarFooter>
      </Sidebar>
      <SidebarInset>{children}</SidebarInset>
    </SidebarProvider>
  );
}
