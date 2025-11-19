'use client';

import { Logo } from '@/components/icons';
import { SettingsTab } from '@/components/settings/settings-tab';
import { TemplatesTab } from '@/components/templates/templates-tab';
import { DashboardTab } from '@/components/dashboard/dashboard-tab';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { UserNav } from '@/components/user-nav';
import { useClockify } from '@/hooks/use-clockify';
import { TimeEntryForm } from '@/components/dashboard/time-entry-form';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { ListPlus, PlusCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';


export default function DashboardPage() {
  const { isConfigured, setSheetOpen } = useClockify();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [showBatchForm, setShowBatchForm] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (isConfigured === false) { // Use explicit false check to avoid redirect during initial load
      router.push('/login');
    }
  }, [isConfigured, router]);

  if (!isConfigured) {
    // Render a loading state or null while we check for credentials
    // This prevents a flash of the dashboard before the redirect happens
    return (
        <div className="h-screen w-full flex items-center justify-center bg-background">
            <Logo className="h-12 w-12 animate-pulse" />
        </div>
    );
  }
  
  return (
    <>
      <div className="flex-col md:flex">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <div className="border-b border-border">
              <div className="flex h-16 items-center px-4 md:px-6">
                <div className="flex items-center text-lg font-bold text-primary">
                    <Logo className="h-6 w-6" />
                    <span className="ml-2 font-semibold text-xl text-foreground">TrackForge</span>
                </div>
                
                <TabsList className="mx-auto">
                  <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
                  <TabsTrigger value="templates">Templates</TabsTrigger>
                  <TabsTrigger value="settings">Settings</TabsTrigger>
                </TabsList>

                <div className="ml-auto flex items-center space-x-4">
                  {activeTab === 'dashboard' && isConfigured && (
                      <div className="flex items-center gap-2">
                        <Button variant="outline" size="sm" onClick={() => setShowBatchForm(!showBatchForm)}>
                          <ListPlus className="mr-2 h-4 w-4" />
                          {showBatchForm ? 'Hide Batch' : 'Batch Entry'}
                        </Button>
                        <Button size="sm" onClick={() => setSheetOpen(true)}>
                          <PlusCircle className="mr-2 h-4 w-4" />
                          New Entry
                        </Button>
                      </div>
                  )}
                  <UserNav />
                </div>
              </div>
            </div>
            <main className="flex-1 space-y-4 p-4 md:p-6">
                <TabsContent value="dashboard" className="space-y-4 mt-0">
                  <DashboardTab showBatchForm={showBatchForm} />
                </TabsContent>
                <TabsContent value="templates" className="space-y-4 mt-0">
                  <TemplatesTab />
                </TabsContent>
                <TabsContent value="settings" className="space-y-4 mt-0">
                  <SettingsTab />
                </TabsContent>
            </main>
        </Tabs>
      </div>
      <TimeEntryForm />
    </>
  );
}
