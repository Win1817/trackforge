'use client';

import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetFooter,
} from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { useClockify } from '@/hooks/use-clockify';
import { toDateTimeLocal } from '@/lib/utils';
import type { Task, TimeEntry, Template } from '@/lib/types';
import { generateTimeEntrySuggestion } from '@/ai/flows/generate-time-entry-suggestions';
import { Sparkles } from 'lucide-react';
import { Spinner } from '../icons';

const formSchema = z.object({
  projectId: z.string().min(1, 'Project is required'),
  taskId: z.string().optional(),
  description: z.string().min(1, 'Description is required'),
  start: z.string().min(1, 'Start time is required'),
  end: z.string().optional(),
  billable: z.boolean().default(false),
});

type FormData = z.infer<typeof formSchema>;

export function TimeEntryForm() {
  const {
    sheetOpen,
    setSheetOpen,
    sheetEntry,
    createTimeEntry,
    updateTimeEntry,
    projects,
    templates,
    fetchProjects,
    fetchTasks,
    loading,
  } = useClockify();

  const [tasks, setTasks] = useState<Task[]>([]);
  const [isFetchingTasks, setIsFetchingTasks] = useState(false);
  const [isSuggesting, setIsSuggesting] = useState(false);

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      projectId: '',
      taskId: '',
      description: '',
      start: toDateTimeLocal(new Date()),
      end: '',
      billable: false,
    },
  });

  const projectId = form.watch('projectId');
  const taskId = form.watch('taskId');

  useEffect(() => {
    if (sheetOpen) {
        fetchProjects();
    }
  }, [sheetOpen, fetchProjects]);

  useEffect(() => {
    if (sheetEntry) {
      form.reset({
        projectId: sheetEntry.projectId || '',
        taskId: sheetEntry.taskId || '',
        description: sheetEntry.description,
        start: toDateTimeLocal(sheetEntry.timeInterval.start),
        end: toDateTimeLocal(sheetEntry.timeInterval.end),
        billable: sheetEntry.billable,
      });
      if (sheetEntry.projectId) {
        handleProjectChange(sheetEntry.projectId);
      }
    } else {
      form.reset({
        projectId: '',
        taskId: '',
        description: '',
        start: toDateTimeLocal(new Date()),
        end: '',
        billable: false,
      });
    }
  }, [sheetEntry, form, sheetOpen]);
  
  const handleProjectChange = async (pId: string) => {
    if (!pId) {
      setTasks([]);
      return;
    }
    setIsFetchingTasks(true);
    const fetchedTasks = await fetchTasks(pId);
    if (fetchedTasks) {
      setTasks(fetchedTasks);
    }
    setIsFetchingTasks(false);
  };
  
  const handleTemplateChange = (templateId: string) => {
    const template = templates.find(t => t.id === templateId);
    if(template) {
        form.setValue('projectId', template.projectId);
        handleProjectChange(template.projectId).then(() => {
            if(template.taskId) form.setValue('taskId', template.taskId);
        });
        form.setValue('description', template.description);
    }
  }

  const handleSuggestion = async () => {
    const project = projects.find((p) => p.id === projectId);
    const task = tasks.find((t) => t.id === taskId);
    if (!project || !task) return;

    setIsSuggesting(true);
    try {
      const result = await generateTimeEntrySuggestion({
        project: project.name,
        task: task.name,
      });
      if (result.suggestion) {
        form.setValue('description', result.suggestion);
      }
    } catch (error) {
      console.error('Failed to get suggestion:', error);
    } finally {
      setIsSuggesting(false);
    }
  };

  const onSubmit = async (data: FormData) => {
    const payload = {
      ...data,
      start: new Date(data.start).toISOString(),
      end: data.end ? new Date(data.end).toISOString() : undefined,
    };
    if (sheetEntry) {
      await updateTimeEntry(sheetEntry.id, payload);
    } else {
      await createTimeEntry(payload);
    }
    if (!loading['createTimeEntry'] && !loading['updateTimeEntry']) {
        setSheetOpen(false);
    }
  };

  return (
    <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
      <SheetContent className="sm:max-w-lg">
        <SheetHeader>
          <SheetTitle>{sheetEntry ? 'Edit' : 'New'} Time Entry</SheetTitle>
          <SheetDescription>
            Fill in the details for your time entry.
          </SheetDescription>
        </SheetHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-6">
            
            {templates.length > 0 && (
                 <FormItem>
                 <FormLabel>Use Template</FormLabel>
                 <Select onValueChange={handleTemplateChange}>
                   <FormControl>
                     <SelectTrigger>
                       <SelectValue placeholder="Select a template" />
                     </SelectTrigger>
                   </FormControl>
                   <SelectContent>
                     {templates.map((template) => (
                       <SelectItem key={template.id} value={template.id}>
                         {template.name}
                       </SelectItem>
                     ))}
                   </SelectContent>
                 </Select>
               </FormItem>
            )}

            <FormField
              control={form.control}
              name="projectId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Project</FormLabel>
                  <Select onValueChange={(value) => {
                    field.onChange(value);
                    handleProjectChange(value);
                  }} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a project" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {projects.map((project) => (
                        <SelectItem key={project.id} value={project.id}>
                          {project.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="taskId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Task</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value} disabled={!projectId || isFetchingTasks}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder={isFetchingTasks ? "Loading tasks..." : "Select a task"} />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {tasks.map((task) => (
                        <SelectItem key={task.id} value={task.id}>
                          {task.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <div className="flex items-center justify-between">
                    <FormLabel>Description</FormLabel>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={handleSuggestion}
                      disabled={!projectId || !taskId || isSuggesting}
                    >
                      {isSuggesting ? (
                        <Spinner className="mr-2 h-4 w-4 animate-spin" />
                      ) : (
                        <Sparkles className="mr-2 h-4 w-4" />
                      )}
                      Suggest
                    </Button>
                  </div>
                  <FormControl>
                    <Textarea placeholder="What did you work on?" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="start"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Start Time</FormLabel>
                    <FormControl>
                      <Input type="datetime-local" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="end"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>End Time</FormLabel>
                    <FormControl>
                      <Input type="datetime-local" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={form.control}
              name="billable"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                  <div className="space-y-0.5">
                    <FormLabel>Billable</FormLabel>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            <SheetFooter>
                <Button type="button" variant="outline" onClick={() => setSheetOpen(false)}>Cancel</Button>
                <Button type="submit" disabled={loading['createTimeEntry'] || loading['updateTimeEntry']}>
                    {(loading['createTimeEntry'] || loading['updateTimeEntry']) && <Spinner className="mr-2 h-4 w-4 animate-spin" />}
                    Save
                </Button>
            </SheetFooter>
          </form>
        </Form>
      </SheetContent>
    </Sheet>
  );
}
