'use client'

import { PlusCircle, Trash, Calendar as CalendarIcon, Copy, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { PageHeader, PageHeaderHeading, PageHeaderDescription } from '@/components/page-header';
import { useClockify } from '@/hooks/use-clockify';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useFieldArray, useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useEffect, useState } from 'react';
import { Template, TemplateEntry } from '@/lib/types';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { format } from 'date-fns';
import { Switch } from '@/components/ui/switch';
import { Spinner } from '@/components/icons';


const templateEntrySchema = z.object({
    id: z.string(),
    projectId: z.string().min(1, "Project is required"),
    taskId: z.string().optional(),
    description: z.string().min(1, "Description is required"),
    startTime: z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/, "Invalid time format (HH:mm)"),
    endTime: z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/, "Invalid time format (HH:mm)"),
    billable: z.boolean().default(false),
});

const templateSchema = z.object({
    name: z.string().min(1, 'Template name is required'),
    entries: z.array(templateEntrySchema).min(1, 'At least one entry is required'),
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
                setTasksByProject(prev => ({...prev, [projectId]: fetchedTasks}));
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
                            <FormItem><FormLabel>Template Name</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                        )} />

                        <div className="flex-grow overflow-y-auto pr-4 -mr-4 space-y-6">
                            {fields.map((field, index) => {
                                const projectId = form.watch(`entries.${index}.projectId`);
                                return (
                                    <div key={field.id} className="p-4 border rounded-lg relative space-y-4 bg-card">
                                        <Button type="button" variant="ghost" size="icon" className="absolute top-2 right-2 h-6 w-6" onClick={() => remove(index)}>
                                            <X className="h-4 w-4" />
                                        </Button>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <Controller
                                                control={form.control}
                                                name={`entries.${index}.projectId`}
                                                render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Project</FormLabel>
                                                    <Select onValueChange={(value) => { field.onChange(value); handleProjectChange(value); }} value={field.value}>
                                                        <FormControl><SelectTrigger><SelectValue placeholder="Select project" /></SelectTrigger></FormControl>
                                                        <SelectContent>{projects.map(p => <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>)}</SelectContent>
                                                    </Select>
                                                    <FormMessage />
                                                </FormItem>
                                                )}
                                            />
                                            <Controller
                                                control={form.control}
                                                name={`entries.${index}.taskId`}
                                                render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Task</FormLabel>
                                                    <Select onValueChange={field.onChange} value={field.value} disabled={!projectId}>
                                                        <FormControl><SelectTrigger><SelectValue placeholder="Select task" /></SelectTrigger></FormControl>
                                                        <SelectContent>{(tasksByProject[projectId] || []).map(t => <SelectItem key={t.id} value={t.id}>{t.name}</SelectItem>)}</SelectContent>
                                                    </Select>
                                                    <FormMessage />
                                                </FormItem>
                                                )}
                                            />
                                        </div>
                                         <Controller
                                            control={form.control}
                                            name={`entries.${index}.description`}
                                            render={({ field }) => (
                                                <FormItem><FormLabel>Description</FormLabel><FormControl><Textarea {...field} rows={2} /></FormControl><FormMessage /></FormItem>
                                            )}
                                        />
                                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 items-end">
                                            <Controller
                                                control={form.control}
                                                name={`entries.${index}.startTime`}
                                                render={({ field }) => (
                                                    <FormItem><FormLabel>Start Time</FormLabel><FormControl><Input type="time" {...field} /></FormControl><FormMessage /></FormItem>
                                                )}
                                            />
                                            <Controller
                                                control={form.control}
                                                name={`entries.${index}.endTime`}
                                                render={({ field }) => (
                                                    <FormItem><FormLabel>End Time</FormLabel><FormControl><Input type="time" {...field} /></FormControl><FormMessage /></FormItem>
                                                )}
                                            />
                                            <Controller
                                                control={form.control}
                                                name={`entries.${index}.billable`}
                                                render={({ field }) => (
                                                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm h-10 bg-background">
                                                        <FormLabel>Billable</FormLabel>
                                                        <FormControl>
                                                            <Switch checked={field.value} onCheckedChange={field.onChange} />
                                                        </FormControl>
                                                    </FormItem>
                                                )}
                                            />
                                        </div>
                                    </div>
                                )}
                            )}
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
    const [popoverOpen, setPopoverOpen] = useState(false);

    const handleApply = () => {
        if(dates && dates.length > 0) {
            applyTemplate(template.id, dates);
            setPopoverOpen(false);
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
                 <Popover open={popoverOpen} onOpenChange={setPopoverOpen}>
                    <PopoverTrigger asChild>
                        <Button>
                            {loading[`applyTemplate-${template.id}`] ? <Spinner className="mr-2 animate-spin"/> : <CalendarIcon className="mr-2 h-4 w-4" />}
                            Apply to...
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="multiple"
                        min={0}
                        selected={dates}
                        onSelect={setDates}
                        initialFocus
                      />
                       <div className="p-2 border-t">
                            <Button onClick={handleApply} disabled={!dates || dates.length === 0 || loading[`applyTemplate-${template.id}`]} className="w-full">
                                {loading[`applyTemplate-${template.id}`] ? <Spinner className="mr-2 animate-spin"/> : null}
                                Apply to {dates?.length || 0} date(s)
                            </Button>
                       </div>
                    </PopoverContent>
                  </Popover>
            </CardContent>
        </Card>
    );
}

export function TemplatesTab() {
    const { templates, saveTemplate, deleteTemplate } = useClockify();
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [editingTemplate, setEditingTemplate] = useState<Template | null>(null);
    
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
            id: crypto.randomUUID(), // create a new id
        }
        saveTemplate(newTemplate, true);
    }
    
    const handleSave = (template: Omit<Template, 'id'> & { id?: string }) => {
        const isNew = !template.id;
        saveTemplate(template, isNew);
    }

    return (
        <div className="container mx-auto">
            <PageHeader>
                <div>
                    <PageHeaderHeading>Templates</PageHeaderHeading>
                    <PageHeaderDescription>
                        Create and manage batches of time entries to apply in bulk.
                    </PageHeaderDescription>
                </div>
                <Button onClick={handleNewTemplate}>
                    <PlusCircle className="mr-2 h-4 w-4" />
                    New Template
                </Button>
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
                            No templates created yet. Click "New Template" to get started.
                        </CardContent>
                    </Card>
                )}
            </div>
        </div>
    );
}
