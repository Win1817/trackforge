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
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ListPlus, PlusCircle } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { DateRange } from 'react-day-picker';
import { addDays, format } from 'date-fns';
import { Input } from '@/components/ui/input';
import { CalendarIcon } from 'lucide-react';

export default function DashboardPage() {
  const { isConfigured, setSheetOpen } = useClockify();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [showBatchForm, setShowBatchForm] = useState(false);
  
  return (
    <>
      <div className="flex-col md:flex">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <div className="border-b">
            <div className="flex h-16 items-center px-4 md:px-6">
              <div className="flex items-center text-lg font-bold text-primary">
                  <Logo className="h-6 w-6" />
                  <span className="ml-2">ClockIT</span>
              </div>
              
              <TabsList className="mx-auto">
                <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
                <TabsTrigger value="templates" disabled={!isConfigured}>Templates</TabsTrigger>
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
          <div className="flex-1 space-y-4 p-4 md:p-6">
              {!isConfigured ? (
                  <Alert className="mb-4 max-w-2xl mx-auto">
                      <AlertTitle>Welcome to ClockIT!</AlertTitle>
                      <AlertDescription>
                          To get started, please go to the settings tab and enter your Clockify API Key and Workspace ID.
                      </AlertDescription>
                  </Alert>
              ) : null}
              <TabsContent value="dashboard" className="space-y-4 mt-0">
                <DashboardTab showBatchForm={showBatchForm} />
              </TabsContent>
              <TabsContent value="templates" className="space-y-4 mt-0">
                <TemplatesTab />
              </TabsContent>
              <TabsContent value="settings" className="space-y-4 mt-0">
                <SettingsTab />
              </TabsContent>
          </div>
        </Tabs>
      </div>
      <TimeEntryForm />
    </>
  );
}
