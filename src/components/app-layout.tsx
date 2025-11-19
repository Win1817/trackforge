'use client';

import * as React from 'react';
import {
  Sidebar,
  SidebarProvider,
  SidebarTrigger,
  SidebarInset,
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
} from '@/components/ui/sidebar';
import { SidebarNav } from '@/components/sidebar-nav';
import { Button } from '@/components/ui/button';
import { UserNav } from '@/components/user-nav';
import { Logo } from '@/components/icons';
import Link from 'next/link';
import { ClockifyProvider } from '@/hooks/use-clockify';
import { TimeEntryForm } from './dashboard/time-entry-form';

export function AppLayout({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = React.useState(true);

  return (
    <ClockifyProvider>
      <SidebarProvider open={open} onOpenChange={setOpen}>
        <Sidebar>
          <SidebarHeader>
            <Button variant="ghost" className="h-10 w-full justify-start px-2 text-lg font-bold" asChild>
                <Link href="/">
                    <Logo className="h-6 w-6" />
                    <span className="ml-2">ClockIT Pro</span>
                </Link>
            </Button>
          </SidebarHeader>
          <SidebarContent>
            <SidebarNav />
          </SidebarContent>
          <SidebarFooter>
            {/* Can add footer content here */}
          </SidebarFooter>
        </Sidebar>
        <SidebarInset>
          <header className="sticky top-0 z-30 flex h-14 items-center justify-between gap-4 border-b bg-background/80 px-4 backdrop-blur-sm sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6">
            <SidebarTrigger className="sm:hidden" />
            <div className="ml-auto">
              <UserNav />
            </div>
          </header>
          <main className="flex-1 p-4 sm:p-6">{children}</main>
          <TimeEntryForm />
        </SidebarInset>
      </SidebarProvider>
    </ClockifyProvider>
  );
}
