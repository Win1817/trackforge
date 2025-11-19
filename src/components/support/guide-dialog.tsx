'use client';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter
} from '@/components/ui/dialog';
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
  } from "@/components/ui/accordion"
import { Button } from '../ui/button';
import { ScrollArea } from '../ui/scroll-area';
  

interface GuideDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export function GuideDialog({ open, onOpenChange }: GuideDialogProps) {
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-2xl">
                <DialogHeader>
                    <DialogTitle>TrackForge Guide</DialogTitle>
                    <DialogDescription>
                        A quick guide on how to use the app and its features.
                    </DialogDescription>
                </DialogHeader>
                <ScrollArea className="h-[60vh] pr-6">
                <Accordion type="single" collapsible className="w-full">
                    <AccordionItem value="item-1">
                        <AccordionTrigger>What is TrackForge?</AccordionTrigger>
                        <AccordionContent className="space-y-2">
                            <p>TrackForge is a professional, web-based tool designed to enhance your productivity with Clockify. It allows you to manage your time entries more efficiently, with a focus on powerful batch processing and templating features.</p>
                            <p>It connects directly to your Clockify account via its API, acting as a more powerful interface for your existing data.</p>
                        </AccordionContent>
                    </AccordionItem>
                    <AccordionItem value="item-2">
                        <AccordionTrigger>Getting Started: API Credentials</AccordionTrigger>
                        <AccordionContent className="space-y-2">
                            <p>To use TrackForge, you need to provide your Clockify API Key and Workspace ID.</p>
                            <ol className="list-decimal list-inside space-y-1 pl-2">
                                <li><strong>API Key:</strong> You can find this in your Clockify account under `Profile Settings` → `API`.</li>
                                <li><strong>Workspace ID:</strong> Navigate to any workspace's `Settings`. The ID is in the URL: `https://app.clockify.me/workspaces/{'{workspaceId}'}/settings`.</li>
                            </ol>
                            <p>Enter these on the Sign-In page. Your credentials are stored securely in your browser's local storage and are never sent anywhere except directly to the Clockify API.</p>
                        </AccordionContent>
                    </AccordionItem>
                    <AccordionItem value="item-3">
                        <AccordionTrigger>The Dashboard: Your Time at a Glance</AccordionTrigger>
                        <AccordionContent className="space-y-2">
                           <p>The main Dashboard tab shows your recent time entries in a filterable and sortable table.</p>
                           <ul className="list-disc list-inside space-y-1 pl-2">
                            <li><strong>Date Range:</strong> Use the date picker to select the time frame you want to view.</li>
                            <li><strong>Filter:</strong> Quickly find entries by typing in the description filter.</li>
                            <li><strong>New Entry:</strong> Click the "New Entry" button to open a form and add a single time entry.</li>
                            <li><strong>Edit/Delete:</strong> Use the action menu (three dots) on any row to edit or delete an entry.</li>
                           </ul>
                        </AccordionContent>
                    </AccordionItem>
                    <AccordionItem value="item-4">
                        <AccordionTrigger>Batch Entry: The Power Feature</AccordionTrigger>
                        <AccordionContent className="space-y-2">
                            <p>Tired of creating entries one by one? The Batch Entry form is for you.</p>
                             <ol className="list-decimal list-inside space-y-1 pl-2">
                                <li>Click the "Batch Entry" button on the dashboard to reveal the form.</li>
                                <li>Click "Add Entry to Batch" to create new rows.</li>
                                <li>For each row, you can select a different project, task, description, and time interval.</li>
                                <li>Once you've built your batch, select a date in the footer and click "Submit Batch" to create all entries at once.</li>
                            </ol>
                        </AccordionContent>
                    </AccordionItem>
                     <AccordionItem value="item-5">
                        <AccordionTrigger>Templates: Automate Your Week</AccordionTrigger>
                        <AccordionContent className="space-y-2">
                            <p>Templates take batching to the next level. If you have a recurring set of tasks, save them as a template.</p>
                            <ul className="list-disc list-inside space-y-1 pl-2">
                                <li><strong>Create Template:</strong> Go to the "Templates" tab and click "New Template". Build your set of entries just like in the Batch Entry form and give it a name.</li>
                                <li><strong>Apply Template:</strong> On the template card, click "Apply to...", select one or more dates from the calendar, and click the "Apply" button. TrackForge will create all the template's entries for each selected date.</li>
                                <li><strong>Import/Export:</strong> You can back up your templates to a JSON file or share them with colleagues using the Import/Export buttons.</li>
                           </ul>
                        </AccordionContent>
                    </AccordionItem>
                    <AccordionItem value="item-6">
                        <AccordionTrigger>Settings & Profile</AccordionTrigger>
                        <AccordionContent className="space-y-2">
                           <p>Click the avatar in the top-right corner to manage your settings.</p>
                            <ul className="list-disc list-inside space-y-1 pl-2">
                                <li><strong>Settings:</strong> Update your API Key or Workspace ID.</li>
                                <li><strong>Support:</strong> Opens this guide.</li>
                                <li><strong>Log out:</strong> Clears your credentials from the browser and returns you to the Sign-In page.</li>
                           </ul>
                        </AccordionContent>
                    </AccordionItem>
                </Accordion>
                </ScrollArea>
                <DialogFooter>
                    <Button onClick={() => onOpenChange(false)}>Close</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
