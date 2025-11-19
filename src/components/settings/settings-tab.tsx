'use client';

import { PageHeader, PageHeaderHeading, PageHeaderDescription } from '@/components/page-header';
import { SettingsForm } from '@/components/settings/settings-form';

export function SettingsTab() {
  return (
    <div className="container max-w-2xl mx-auto">
      <PageHeader>
        <div>
          <PageHeaderHeading>Settings</PageHeaderHeading>
          <PageHeaderDescription>
            Manage your Clockify API credentials.
          </PageHeaderDescription>
        </div>
      </PageHeader>
      <SettingsForm />
    </div>
  );
}
