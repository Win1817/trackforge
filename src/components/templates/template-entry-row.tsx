'use client'

import { Controller, UseFormReturn } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { X } from 'lucide-react';
import { Project } from '@/lib/types';

interface TemplateEntryRowProps {
    form: UseFormReturn<any>;
    index: number;
    projects: Project[];
    tasksByProject: Record<string, any[]>;
    onProjectChange: (projectId: string) => void;
    onRemove: () => void;
}

export function TemplateEntryRow({
    form,
    index,
    projects,
    tasksByProject,
    onProjectChange,
    onRemove,
}: TemplateEntryRowProps) {
    const projectId = form.watch(`entries.${index}.projectId`);

    return (
        <div className="p-4 border rounded-lg relative space-y-4 bg-card">
            <Button type="button" variant="ghost" size="icon" className="absolute top-2 right-2 h-6 w-6" onClick={onRemove}>
                <X className="h-4 w-4" />
            </Button>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Controller
                    control={form.control}
                    name={`entries.${index}.projectId`}
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Project</FormLabel>
                            <Select onValueChange={(value) => { field.onChange(value); onProjectChange(value); }} value={field.value}>
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
    )
}
