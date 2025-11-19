'use client';

import { Logo } from '@/components/icons';
import { SettingsTab } from '@/components/settings/settings-tab';
import { TemplatesTab } from '@/components/templates/templates-tab';
import { DashboardTab } from '@/components/dashboard/dashboard-tab';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { UserNav } from '@/components/user-nav';
import { useClockify } from '@/hooks/use-clockify';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { TimeEntryForm } from '@/components/dashboard/time-entry-form';

export default function DashboardPage() {
  const { isConfigured } = useClockify();

  return (
    <>
      <div className="flex-col md:flex">
        <div className="border-b bg-primary text-primary-foreground">
          <div className="container flex h-16 items-center">
            <div className="flex items-center text-lg font-bold">
                <Logo className="h-6 w-6" />
                <span className="ml-2">ClockIT</span>
            </div>
            <div className="ml-auto flex items-center space-x-4">
              <UserNav />
            </div>
          </div>
        </div>
        <div className="container flex-1 space-y-4 p-8 pt-6">
            {!isConfigured ? (
                 <Alert className="mb-4 max-w-2xl mx-auto">
                    <AlertTitle>Welcome to ClockIT!</AlertTitle>
                    <AlertDescription>
                        To get started, please go to the settings tab and enter your Clockify API Key and Workspace ID.
                    </AlertDescription>
                </Alert>
            ) : null}
          <Tabs defaultValue="dashboard" className="space-y-4">
            <TabsList>
              <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
              <TabsTrigger value="templates" disabled={!isConfigured}>Templates</TabsTrigger>
              <TabsTrigger value="settings">Settings</TabsTrigger>
            </TabsList>
            <TabsContent value="dashboard" className="space-y-4">
              <DashboardTab />
            </TabsContent>
            <TabsContent value="templates" className="space-y-4">
              <TemplatesTab />
            </TabsContent>
            <TabsContent value="settings" className="space-y-4">
              <SettingsTab />
            </TabsContent>
          </Tabs>
        </div>
      </div>
      <TimeEntryForm />
    </>
  );
}
