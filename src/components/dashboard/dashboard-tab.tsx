'use client';

import { PlusCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { PageHeader, PageHeaderHeading } from '@/components/page-header';
import { TimeEntryDataTable } from '@/components/dashboard/time-entry-data-table';
import { useClockify } from '@/hooks/use-clockify';

export function DashboardTab() {
  const { isConfigured, setSheetOpen } = useClockify();

  if (!isConfigured) {
    return null;
  }

  return (
    <>
      <PageHeader>
        <PageHeaderHeading>Time Entries</PageHeaderHeading>
        <div className="flex items-center gap-2">
          <Button onClick={() => setSheetOpen(true)}>
            <PlusCircle className="mr-2 h-4 w-4" />
            New Entry
          </Button>
        </div>
      </PageHeader>
      
      <TimeEntryDataTable />
    </>
  );
}
