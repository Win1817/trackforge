'use client';

import { useFieldArray, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useClockify } from '@/hooks/use-clockify';
import { useEffect, useState } from 'react';
import { TemplateEntry } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Form } from '@/components/ui/form';
import { PlusCircle, Trash, X } from 'lucide-react';
import { TemplateEntryRow } from '../templates/template-entry-row';
import { DatePicker } from '../date-picker';
import { Spinner } from '../icons';

const batchEntrySchema = z.object({
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

type BatchEntryFormData = z.infer<typeof batchEntrySchema>;

export function BatchEntryForm() {
    const { applyTemplate, loading, projects, fetchProjects, fetchTasks } = useClockify();
    const [tasksByProject, setTasksByProject] = useState<Record<string, any[]>>({});
    const [date, setDate] = useState<Date>(new Date());
    
    const form = useForm<BatchEntryFormData>({
        resolver: zodResolver(batchEntrySchema),
        defaultValues: { entries: [] },
    });

    const { fields, append, remove } = useFieldArray({
        control: form.control,
        name: "entries",
    });

    useEffect(() => {
        fetchProjects();
    }, [fetchProjects]);

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

    const onSubmit = (data: BatchEntryFormData) => {
        const batchTemplate = {
            id: `batch-${Date.now()}`,
            name: 'Batch Entry',
            entries: data.entries,
        }
        applyTemplate(batchTemplate, [date]);
        form.reset({ entries: [] });
    };
    
    const isLoading = loading[`applyTemplate-${`batch-${Date.now()}`.substring(0,11)}`];

    return (
        <Card className="mb-6">
            <CardHeader>
                <CardTitle>Batch Time Entry</CardTitle>
            </CardHeader>
            <CardContent>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="flex-grow overflow-hidden flex flex-col gap-4">
                        <div className="flex-grow overflow-y-auto pr-4 -mr-4 space-y-6 max-h-[50vh]">
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

                        <Button type="button" variant="outline" onClick={addNewEntry} className="mt-4">
                            <PlusCircle className="mr-2 h-4 w-4" /> Add Entry to Batch
                        </Button>
                        
                        <CardFooter className="flex justify-end items-center gap-4 pt-4 border-t mt-4">
                            <div className="flex items-center gap-2">
                                <span className="text-sm font-medium">Apply to date:</span>
                                <DatePicker date={date} setDate={setDate} />
                            </div>
                            <Button type="submit" disabled={isLoading || fields.length === 0}>
                                {isLoading && <Spinner className="mr-2 animate-spin"/>}
                                Submit Batch
                            </Button>
                        </CardFooter>
                    </form>
                </Form>
            </CardContent>
        </Card>
    );
}
