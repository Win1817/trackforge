'use client';

import { TimeEntryDataTable } from '@/components/dashboard/time-entry-data-table';
import { useClockify } from '@/hooks/use-clockify';
import { BatchEntryForm } from './batch-entry-form';

export function DashboardTab({ showBatchForm }: { showBatchForm: boolean }) {
  const { isConfigured } = useClockify();

  if (!isConfigured) {
    return null;
  }

  return (
    <>
      <h1 className="text-3xl font-bold tracking-tight">Time Entries</h1>
      
      {showBatchForm && <BatchEntryForm />}

      <TimeEntryDataTable />
    </>
  );
}
