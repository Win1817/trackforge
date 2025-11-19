'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';

import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useClockify } from '@/hooks/use-clockify';
import { useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { useToast } from '@/hooks/use-toast';

const formSchema = z.object({
  apiKey: z.string().min(1, 'API Key is required.'),
  workspaceId: z.string().min(1, 'Workspace ID is required.'),
});

export function SettingsForm() {
  const { apiKey, workspaceId, setCredentials } = useClockify();
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      apiKey: '',
      workspaceId: '',
    },
  });

  useEffect(() => {
    if (apiKey) form.setValue('apiKey', apiKey);
    if (workspaceId) form.setValue('workspaceId', workspaceId);
  }, [apiKey, workspaceId, form]);

  function onSubmit(values: z.infer<typeof formSchema>) {
    setCredentials(values.apiKey, values.workspaceId);
    toast({
        title: "Settings saved",
        description: "Your credentials have been updated.",
    })
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>API Credentials</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="apiKey"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Clockify API Key</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter your API key" {...field} type="password" />
                  </FormControl>
                  <FormDescription>
                    You can find your API key in your Clockify profile settings.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="workspaceId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Workspace ID</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter your Workspace ID" {...field} />
                  </FormControl>
                  <FormDescription>
                    Find this in your workspace settings URL.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit">Save Changes</Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
