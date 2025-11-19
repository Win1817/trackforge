'use client'

import { PlusCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { PageHeader, PageHeaderHeading, PageHeaderDescription } from '@/components/page-header';
import { useClockify } from '@/hooks/use-clockify';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useEffect, useState } from 'react';
import { Trash } from 'lucide-react';

const templateSchema = z.object({
    name: z.string().min(1, 'Template name is required'),
    projectId: z.string().min(1, 'Project is required'),
    taskId: z.string().optional(),
    description: z.string().min(1, 'Description is required'),
});

function TemplateForm({ open, setOpen, onSave }: { open: boolean, setOpen: (open: boolean) => void, onSave: (data: any) => void }) {
    const { projects, fetchProjects, fetchTasks } = useClockify();
    const [tasks, setTasks] = useState<any[]>([]);
    
    const form = useForm({
        resolver: zodResolver(templateSchema),
        defaultValues: { name: '', projectId: '', taskId: '', description: '' },
    });

    useEffect(() => {
        if(open) fetchProjects();
    }, [open, fetchProjects]);
    
    const projectId = form.watch('projectId');
    
    useEffect(() => {
        if (projectId) {
            fetchTasks(projectId).then(tasks => setTasks(tasks || []));
        } else {
            setTasks([]);
        }
    }, [projectId, fetchTasks]);

    const onSubmit = (data: z.infer<typeof templateSchema>) => {
        onSave(data);
        setOpen(false);
        form.reset();
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>New Template</DialogTitle>
                    <DialogDescription>Create a new time entry template for quick use.</DialogDescription>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <FormField control={form.control} name="name" render={({ field }) => (
                            <FormItem><FormLabel>Template Name</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                        )} />
                        <FormField control={form.control} name="projectId" render={({ field }) => (
                            <FormItem><FormLabel>Project</FormLabel><Select onValueChange={field.onChange} value={field.value}><FormControl><SelectTrigger><SelectValue placeholder="Select project" /></SelectTrigger></FormControl><SelectContent>{projects.map(p => <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>)}</SelectContent></Select><FormMessage /></FormItem>
                        )} />
                        <FormField control={form.control} name="taskId" render={({ field }) => (
                            <FormItem><FormLabel>Task</FormLabel><Select onValueChange={field.onChange} value={field.value} disabled={!projectId}><FormControl><SelectTrigger><SelectValue placeholder="Select task" /></SelectTrigger></FormControl><SelectContent>{tasks.map(t => <SelectItem key={t.id} value={t.id}>{t.name}</SelectItem>)}</SelectContent></Select><FormMessage /></FormItem>
                        )} />
                        <FormField control={form.control} name="description" render={({ field }) => (
                             <FormItem><FormLabel>Description</FormLabel><FormControl><Textarea {...field} /></FormControl><FormMessage /></FormItem>
                        )} />
                        <DialogFooter>
                            <Button type="button" variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
                            <Button type="submit">Save Template</Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
}

export default function TemplatesPage() {
    const { templates, saveTemplate, deleteTemplate, isConfigured } = useClockify();
    const [open, setOpen] = useState(false);
    
    if (!isConfigured) {
        return (
             <div className="container max-w-2xl mx-auto">
                <PageHeader>
                    <div>
                        <PageHeaderHeading>Templates</PageHeaderHeading>
                        <PageHeaderDescription>
                            Please configure your API Key in settings to use templates.
                        </PageHeaderDescription>
                    </div>
                </PageHeader>
            </div>
        )
    }

  return (
    <div className="container mx-auto py-8">
        <PageHeader>
            <div>
                <PageHeaderHeading>Templates</PageHeaderHeading>
                <PageHeaderDescription>
                    Manage your reusable time entry templates.
                </PageHeaderDescription>
            </div>
            <Button onClick={() => setOpen(true)}>
                <PlusCircle className="mr-2 h-4 w-4" />
                New Template
            </Button>
        </PageHeader>
        <TemplateForm open={open} setOpen={setOpen} onSave={saveTemplate} />

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {templates.length > 0 ? templates.map(template => (
                <Card key={template.id}>
                    <CardHeader className="flex flex-row items-center justify-between">
                        <CardTitle className="text-lg">{template.name}</CardTitle>
                        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => deleteTemplate(template.id)}>
                            <Trash className="h-4 w-4 text-destructive" />
                        </Button>
                    </CardHeader>
                    <CardContent>
                        <p className="text-sm text-muted-foreground line-clamp-3">{template.description}</p>
                    </CardContent>
                </Card>
            )) : (
                <p className="text-muted-foreground col-span-full text-center">No templates created yet.</p>
            )}
        </div>
    </div>
  );
}
