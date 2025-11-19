'use client';

import { PlusCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { PageHeader, PageHeaderHeading } from '@/components/page-header';
import { TimeEntryDataTable } from '@/components/dashboard/time-entry-data-table';
import { useClockify } from '@/hooks/use-clockify';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import Link from 'next/link';

export default function DashboardPage() {
  const { isConfigured, setSheetOpen } = useClockify();

  return (
    <div className="container mx-auto py-8">
      <PageHeader>
        <PageHeaderHeading>Time Entries</PageHeaderHeading>
        <div className="flex items-center gap-2">
          <Button onClick={() => setSheetOpen(true)}>
            <PlusCircle className="mr-2 h-4 w-4" />
            New Entry
          </Button>
        </div>
      </PageHeader>
      
      {!isConfigured && (
        <Alert className="mb-4">
          <AlertTitle>Configuration needed</AlertTitle>
          <AlertDescription>
            Please set your Clockify API Key and Workspace ID in the{' '}
            <Button variant="link" asChild className="p-0 h-auto">
                <Link href="/settings">settings</Link>
            </Button>{' '}
            page to start tracking time.
          </AlertDescription>
        </Alert>
      )}

      <TimeEntryDataTable />
    </div>
  );
}
