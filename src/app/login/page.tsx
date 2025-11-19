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
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';
import { Logo, Spinner } from '@/components/icons';
import { useEffect, useState } from 'react';

const formSchema = z.object({
  apiKey: z.string().min(1, 'API Key is required.'),
  workspaceId: z.string().min(1, 'Workspace ID is required.'),
});

export default function LoginPage() {
  const { setCredentials, isConfigured } = useClockify();
  const { toast } = useToast();
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      apiKey: '',
      workspaceId: '',
    },
  });

  useEffect(() => {
    if (isConfigured) {
      router.push('/');
    }
  }, [isConfigured, router]);

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true);
    try {
        // A simple test to verify credentials. Fetching user is a good way to do this.
        const response = await fetch('https://api.clockify.me/api/v1/user', {
            headers: { 'X-Api-Key': values.apiKey }
        });
        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'Invalid API Key or Workspace ID');
        }
        
        setCredentials(values.apiKey, values.workspaceId);
        toast({
            title: "Authentication Successful",
            description: "Welcome to TrackForge!",
        });
        router.push('/');
    } catch(e: any) {
        toast({
            variant: "destructive",
            title: "Authentication Failed",
            description: e.message,
        });
    } finally {
        setIsSubmitting(false);
    }
  }

  if (isConfigured === undefined || isConfigured) {
    return (
        <div className="h-screen w-full flex items-center justify-center bg-background">
            <Logo className="h-12 w-12 animate-pulse" />
        </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
        <div className="w-full max-w-md space-y-8">
            <div className="text-center">
                <Logo className="mx-auto h-12 w-auto" />
                <h2 className="mt-6 text-3xl font-extrabold text-foreground">
                    Sign in to TrackForge
                </h2>
                <p className="mt-2 text-sm text-muted-foreground">
                    Enter your Clockify credentials to continue
                </p>
            </div>
            <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-8">
                <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <FormField
                    control={form.control}
                    name="apiKey"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Clockify API Key</FormLabel>
                        <FormControl>
                            <Input placeholder="Enter your API key" {...field} type="password" />
                        </FormControl>
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
                            You can find these in your Clockify settings.
                        </FormDescription>
                        <FormMessage />
                        </FormItem>
                    )}
                    />
                    <Button type="submit" className="w-full" disabled={isSubmitting}>
                        {isSubmitting && <Spinner className="mr-2 animate-spin" />}
                        Sign In
                    </Button>
                </form>
                </Form>
            </div>
             <p className="mt-10 text-center text-sm text-muted-foreground">
                TrackForge — A powerful time-tracking and productivity manager.<br/>
                TrackForge is a third-party application and is not affiliated with Clockify.<br/>
                Developed by Surely Win Dilag. All rights reserved.
            </p>
        </div>
    </div>
  );
}
