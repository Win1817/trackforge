'use client'

import { PlusCircle, Trash, Copy, Upload, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { PageHeader, PageHeaderHeading, PageHeaderDescription } from '@/components/page-header';
import { useClockify } from '@/hooks/use-clockify';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useFieldArray, useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useEffect, useState, useRef } from 'react';
import { Template } from '@/lib/types';
import { Spinner } from '@/components/icons';
import { TemplateEntryRow } from './template-entry-row';
import { DatePicker } from '../date-picker';


const templateSchema = z.object({
    name: z.string().min(1, 'Template name is required'),
    entries: z.array(z.object({
        id: z.string(),
        projectId: z.string().min(1, "Project is required"),
        taskId: z.string().optional(),
        description: z.string().min(1, "Description is required"),
        startTime: z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/, "Invalid time format (HH:mm)"),
        endTime: z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/, "Invalid time format (HH:mm)"),
        billable: z.boolean().default(false),
    })).min(1, 'At least one entry is required'),
});

type TemplateFormData = z.infer<typeof templateSchema>;

function TemplateForm({ open, setOpen, onSave, existingTemplate }: { open: boolean, setOpen: (open: boolean) => void, onSave: (data: any) => void, existingTemplate?: Template | null }) {
    const { projects, fetchProjects, fetchTasks } = useClockify();
    const [tasksByProject, setTasksByProject] = useState<Record<string, any[]>>({});

    const form = useForm<TemplateFormData>({
        resolver: zodResolver(templateSchema),
        defaultValues: { name: '', entries: [] },
    });
    
    const { fields, append, remove } = useFieldArray({
        control: form.control,
        name: "entries",
    });

    useEffect(() => {
        if (open) fetchProjects();
    }, [open, fetchProjects]);
    
    useEffect(() => {
        if(existingTemplate) {
            const newEntries = existingTemplate.entries.map(e => ({...e, id: crypto.randomUUID()}));
            form.reset({
                name: existingTemplate.name,
                entries: newEntries
            });
            newEntries.forEach((entry) => {
                if (entry.projectId) {
                    handleProjectChange(entry.projectId);
                }
            })
        } else {
            form.reset({ name: '', entries: [] });
        }
    }, [existingTemplate, form, open]);

    const handleProjectChange = async (projectId: string) => {
        if (!tasksByProject[projectId]) {
            const fetchedTasks = await fetchTasks(projectId);
            if (fetchedTasks) {
                setTasksByProject(prev => ({ ...prev, [projectId]: fetchedTasks }));
            }
        }
    };
    
    const addNewEntry = () => {
        append({
            id: crypto.randomUUID(),
            projectId: '',
            description: '',
            startTime: '09:00',
            endTime: '10:00',
            billable: false,
        });
    };

    const onSubmit = (data: TemplateFormData) => {
        onSave({ id: existingTemplate?.id, ...data });
        setOpen(false);
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent className="max-w-4xl h-[90vh] flex flex-col">
                <DialogHeader>
                    <DialogTitle>{existingTemplate ? 'Edit' : 'New'} Template</DialogTitle>
                    <DialogDescription>
                        {existingTemplate ? 'Edit your' : 'Create a new'} batch of time entries. Add multiple entries to build a full day schedule or a collection of tasks.
                    </DialogDescription>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="flex-grow overflow-hidden flex flex-col gap-4">
                        <FormField control={form.control} name="name" render={({ field }) => (
                            <FormItem>
                                <FormLabel>Template Name</FormLabel>
                                <FormControl><Input {...field} /></FormControl>
                                <FormMessage />
                            </FormItem>
                        )} />

                        <div className="flex-grow overflow-y-auto pr-4 -mr-4 space-y-6">
                            {fields.map((field, index) => (
                                <TemplateEntryRow
                                    key={field.id}
                                    form={form}
                                    index={index}
                                    projects={projects}
                                    tasksByProject={tasksByProject}
                                    onProjectChange={handleProjectChange}
                                    onRemove={() => remove(index)}
                                />
                            ))}
                        </div>

                        <Button type="button" variant="outline" onClick={addNewEntry}>
                            <PlusCircle className="mr-2 h-4 w-4" /> Add Entry to Batch
                        </Button>
                        
                        <DialogFooter className="pt-4 border-t">
                            <Button type="button" variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
                            <Button type="submit">Save Template</Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
}

function TemplateCard({ template, onEdit, onCopy, onDelete }: { template: Template, onEdit: () => void, onCopy: () => void, onDelete: () => void }) {
    const { applyTemplate, loading } = useClockify();
    const [dates, setDates] = useState<Date[] | undefined>([]);

    const handleApply = () => {
        if(dates && dates.length > 0) {
            applyTemplate(template, dates);
            setDates([]);
        }
    }
    
    const totalDuration = template.entries.reduce((acc, entry) => {
        const [startH, startM] = entry.startTime.split(':').map(Number);
        const [endH, endM] = entry.endTime.split(':').map(Number);
        const start = new Date(0,0,0,startH, startM);
        const end = new Date(0,0,0,endH, endM);
        return acc + (end.getTime() - start.getTime());
    }, 0);
    
    const hours = Math.floor(totalDuration / (1000 * 60 * 60));
    const minutes = Math.floor((totalDuration % (1000 * 60 * 60)) / (1000 * 60));

    const isLoading = loading[`applyTemplate-${template.id}`];

    return (
         <Card>
            <CardHeader>
                <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">{template.name}</CardTitle>
                    <div className="flex items-center gap-1">
                        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={onCopy}><Copy className="h-4 w-4" /></Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={onDelete}><Trash className="h-4 w-4 text-destructive" /></Button>
                    </div>
                </div>
                <CardDescription>
                    {template.entries.length} {template.entries.length === 1 ? 'entry' : 'entries'} | Total: {hours}h {minutes}m
                </CardDescription>
            </CardHeader>
            <CardContent className="flex justify-between items-center">
                 <Button onClick={onEdit}>Edit Template</Button>
                 <DatePicker
                    multi
                    dates={dates}
                    setDates={setDates}
                    onApply={handleApply}
                    isLoading={isLoading}
                 />
            </CardContent>
        </Card>
    );
}

export function TemplatesTab() {
    const { templates, saveTemplate, deleteTemplate, importTemplates, exportTemplates } = useClockify();
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [editingTemplate, setEditingTemplate] = useState<Template | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    
    const handleNewTemplate = () => {
        setEditingTemplate(null);
        setIsFormOpen(true);
    }
    
    const handleEditTemplate = (template: Template) => {
        setEditingTemplate(template);
        setIsFormOpen(true);
    }

    const handleCopyTemplate = (template: Template) => {
        const newTemplate = {
            ...template,
            name: `${template.name} (Copy)`,
        }
        saveTemplate(newTemplate, true);
    }
    
    const handleSave = (template: Omit<Template, 'id'> & { id?: string }) => {
        const isNew = !template.id;
        saveTemplate(template, isNew);
    }

    const handleImportClick = () => {
        fileInputRef.current?.click();
    };

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            importTemplates(file);
        }
        // Reset file input to allow importing the same file again
        if(fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    return (
        <div className="mx-auto">
            <PageHeader>
                <div>
                    <PageHeaderHeading>Templates</PageHeaderHeading>
                    <PageHeaderDescription>
                        Create and manage batches of time entries to apply in bulk.
                    </PageHeaderDescription>
                </div>
                <div className="flex items-center gap-2">
                    <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleFileChange}
                        className="hidden"
                        accept="application/json"
                    />
                    <Button variant="outline" onClick={handleImportClick}>
                        <Upload className="mr-2 h-4 w-4" />
                        Import
                    </Button>
                    <Button variant="outline" onClick={exportTemplates} disabled={templates.length === 0}>
                        <Download className="mr-2 h-4 w-4" />
                        Export
                    </Button>
                    <Button onClick={handleNewTemplate}>
                        <PlusCircle className="mr-2 h-4 w-4" />
                        New Template
                    </Button>
                </div>
            </PageHeader>
            
            <TemplateForm open={isFormOpen} setOpen={setIsFormOpen} onSave={handleSave} existingTemplate={editingTemplate} />

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {templates.length > 0 ? templates.map(template => (
                    <TemplateCard 
                        key={template.id} 
                        template={template}
                        onEdit={() => handleEditTemplate(template)}
                        onCopy={() => handleCopyTemplate(template)}
                        onDelete={() => deleteTemplate(template.id)}
                    />
                )) : (
                    <Card className="col-span-full">
                        <CardContent className="pt-6 text-center text-muted-foreground">
                            No templates created yet. Click "New Template" to get started, or import a file.
                        </CardContent>
                    </Card>
                )}
            </div>
        </div>
    );
}
