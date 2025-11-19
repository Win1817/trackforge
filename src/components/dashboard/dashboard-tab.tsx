'use client';

import { PlusCircle, ListPlus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { PageHeader, PageHeaderHeading } from '@/components/page-header';
import { TimeEntryDataTable } from '@/components/dashboard/time-entry-data-table';
import { useClockify } from '@/hooks/use-clockify';
import { BatchEntryForm } from './batch-entry-form';
import { useState } from 'react';

export function DashboardTab() {
  const { isConfigured, setSheetOpen } = useClockify();
  const [showBatchForm, setShowBatchForm] = useState(false);

  if (!isConfigured) {
    return null;
  }

  return (
    <>
      <PageHeader>
        <PageHeaderHeading>Time Entries</PageHeaderHeading>
        <div className="flex items-center gap-2">
           <Button variant="outline" onClick={() => setShowBatchForm(!showBatchForm)}>
            <ListPlus className="mr-2 h-4 w-4" />
            {showBatchForm ? 'Hide Batch Entry' : 'Batch Entry'}
          </Button>
          <Button onClick={() => setSheetOpen(true)}>
            <PlusCircle className="mr-2 h-4 w-4" />
            New Entry
          </Button>
        </div>
      </PageHeader>
      
      {showBatchForm && <BatchEntryForm />}

      <TimeEntryDataTable />
    </>
  );
}
