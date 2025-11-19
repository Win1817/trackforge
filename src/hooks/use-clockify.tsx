'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import type { ClockifyUser, Project, Task, TimeEntry, TimeEntryRequest, Template } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';

const CLOCKIFY_API_URL = 'https://api.clockify.me/api/v1';

interface ClockifyContextType {
  apiKey: string | null;
  workspaceId: string | null;
  setCredentials: (apiKey: string, workspaceId: string) => void;
  isConfigured: boolean;
  user: ClockifyUser | null;
  projects: Project[];
  timeEntries: TimeEntry[];
  templates: Template[];
  fetchProjects: () => Promise<Project[] | undefined>;
  fetchTasks: (projectId: string) => Promise<Task[] | undefined>;
  fetchTimeEntries: (params?: { start?: Date, end?: Date }) => Promise<void>;
  createTimeEntry: (data: TimeEntryRequest) => Promise<TimeEntry | undefined>;
  updateTimeEntry: (id: string, data: TimeEntryRequest) => Promise<TimeEntry | undefined>;
  deleteTimeEntry: (id: string) => Promise<boolean>;
  loading: Record<string, boolean>;
  error: Record<string, any>;
  sheetOpen: boolean;
  setSheetOpen: (open: boolean, entry?: TimeEntry | null) => void;
  sheetEntry: TimeEntry | null;
  saveTemplate: (template: Omit<Template, 'id'> & { id?: string }) => void;
  deleteTemplate: (templateId: string) => void;
  applyTemplate: (templateId: string, dates: Date[]) => Promise<void>;
}

const ClockifyContext = createContext<ClockifyContextType | undefined>(undefined);

export const ClockifyProvider = ({ children }: { children: React.ReactNode }) => {
  const [apiKey, setApiKey] = useState<string | null>(null);
  const [workspaceId, setWorkspaceId] = useState<string | null>(null);
  const [user, setUser] = useState<ClockifyUser | null>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const [timeEntries, setTimeEntries] = useState<TimeEntry[]>([]);
  const [templates, setTemplates] = useState<Template[]>([]);

  const [loading, setLoading] = useState<Record<string, boolean>>({});
  const [error, setError] = useState<Record<string, any>>({});
  
  const [sheetOpen, _setSheetOpen] = useState(false);
  const [sheetEntry, setSheetEntry] = useState<TimeEntry | null>(null);

  const { toast } = useToast();

  const setSheetOpen = (open: boolean, entry: TimeEntry | null = null) => {
    setSheetEntry(entry);
    _setSheetOpen(open);
  };

  useEffect(() => {
    const storedApiKey = localStorage.getItem('clockify_api_key');
    const storedWorkspaceId = localStorage.getItem('clockify_workspace_id');
    const storedTemplates = localStorage.getItem('clockify_templates_v2'); // Use new key for new structure
    if (storedApiKey) setApiKey(storedApiKey);
    if (storedWorkspaceId) setWorkspaceId(storedWorkspaceId);
    if(storedTemplates) {
      setTemplates(JSON.parse(storedTemplates));
    } else {
      // Migration from old single-entry templates
      const oldTemplates = localStorage.getItem('clockify_templates');
      if (oldTemplates) {
        try {
          const parsedOld = JSON.parse(oldTemplates);
          if (Array.isArray(parsedOld)) {
            const newTemplates = parsedOld.map((t: any) => ({
              id: t.id,
              name: t.name,
              entries: [{
                id: crypto.randomUUID(),
                projectId: t.projectId,
                taskId: t.taskId,
                description: t.description,
                startTime: '09:00',
                endTime: '17:00',
                billable: false,
              }]
            }));
            setTemplates(newTemplates);
            localStorage.setItem('clockify_templates_v2', JSON.stringify(newTemplates));
            localStorage.removeItem('clockify_templates');
          }
        } catch(e) {
            console.error("Failed to migrate old templates", e)
        }
      }
    }
  }, []);

  const setCredentials = (newApiKey: string, newWorkspaceId: string) => {
    localStorage.setItem('clockify_api_key', newApiKey);
    localStorage.setItem('clockify_workspace_id', newWorkspaceId);
    setApiKey(newApiKey);
    setWorkspaceId(newWorkspaceId);
  };

  const isConfigured = !!apiKey && !!workspaceId;

  const apiFetch = useCallback(async (endpoint: string, options: RequestInit = {}) => {
    if (!isConfigured) {
        console.error('API Key or Workspace ID is not configured.');
        return;
    }
    
    const response = await fetch(`${CLOCKIFY_API_URL}${endpoint}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        'X-Api-Key': apiKey,
        ...options.headers,
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
    }
    // Some DELETE requests return 204 with no content
    if (response.status === 204) return;
    return response.json();
  }, [apiKey, isConfigured]);

  const runAsync = useCallback(async <T,>(key: string, asyncFn: () => Promise<T>): Promise<T | undefined> => {
    setLoading(prev => ({ ...prev, [key]: true }));
    setError(prev => ({ ...prev, [key]: null }));
    try {
      const result = await asyncFn();
      return result;
    } catch (e: any) {
      setError(prev => ({ ...prev, [key]: e.message }));
      toast({
        variant: "destructive",
        title: "An error occurred",
        description: e.message,
      });
      return undefined;
    } finally {
      setLoading(prev => ({ ...prev, [key]: false }));
    }
  }, [toast]);

  const fetchCurrentUser = useCallback(async () => {
    if (!isConfigured) return;
    const userData = await runAsync('user', () => apiFetch('/user'));
    if (userData) setUser(userData);
  }, [apiFetch, runAsync, isConfigured]);

  const fetchProjects = useCallback(async () => {
    if (!isConfigured) return;
    const projectData = await runAsync('projects', () => apiFetch(`/workspaces/${workspaceId}/projects?hydrated=true`));
    if (projectData) {
      setProjects(projectData);
      return projectData;
    }
  }, [apiFetch, runAsync, isConfigured, workspaceId]);
  
  const fetchTasks = useCallback(async (projectId: string) => {
    if (!isConfigured) return;
    return runAsync(`tasks-${projectId}`, () => apiFetch(`/workspaces/${workspaceId}/projects/${projectId}/tasks`));
  }, [apiFetch, runAsync, isConfigured, workspaceId]);
  
  const fetchTimeEntries = useCallback(async (params: { start?: Date, end?: Date } = {}) => {
    if (!isConfigured || !user) return;
    const query = new URLSearchParams({ hydrated: 'true' });
    if (params.start) query.append('start', params.start.toISOString());
    if (params.end) query.append('end', params.end.toISOString());

    const entries = await runAsync('timeEntries', () => apiFetch(`/workspaces/${workspaceId}/user/${user.id}/time-entries?${query.toString()}`));
    if (entries) setTimeEntries(entries);
  }, [apiFetch, runAsync, isConfigured, workspaceId, user]);
  
  const createTimeEntry = useCallback(async (data: TimeEntryRequest) => {
    if (!isConfigured) return;
    const newEntry = await runAsync('createTimeEntry', () => apiFetch(`/workspaces/${workspaceId}/time-entries`, {
      method: 'POST',
      body: JSON.stringify(data),
    }));
    if (newEntry) {
      toast({ title: "Success", description: "Time entry created." });
      fetchTimeEntries();
      return newEntry;
    }
  }, [apiFetch, runAsync, isConfigured, workspaceId, toast, fetchTimeEntries]);

  const updateTimeEntry = useCallback(async (id: string, data: TimeEntryRequest) => {
    if (!isConfigured) return;
    const updatedEntry = await runAsync('updateTimeEntry', () => apiFetch(`/workspaces/${workspaceId}/time-entries/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }));
    if (updatedEntry) {
      toast({ title: "Success", description: "Time entry updated." });
      fetchTimeEntries();
      return updatedEntry;
    }
  }, [apiFetch, runAsync, isConfigured, workspaceId, toast, fetchTimeEntries]);

  const deleteTimeEntry = useCallback(async (id: string) => {
    if (!isConfigured) return false;
    const result = await runAsync('deleteTimeEntry', async () => {
      await apiFetch(`/workspaces/${workspaceId}/time-entries/${id}`, { method: 'DELETE' });
      return true;
    });
    if (result) {
      toast({ title: "Success", description: "Time entry deleted." });
      fetchTimeEntries();
      return true;
    }
    return false;
  }, [apiFetch, runAsync, isConfigured, workspaceId, toast, fetchTimeEntries]);

  const saveTemplate = (template: Omit<Template, 'id'> & { id?: string }) => {
    let newTemplates;
    if (template.id) {
        newTemplates = templates.map(t => t.id === template.id ? { ...t, ...template } : t);
    } else {
        newTemplates = [...templates, { ...template, id: crypto.randomUUID() }];
    }
    setTemplates(newTemplates);
    localStorage.setItem('clockify_templates_v2', JSON.stringify(newTemplates));
    toast({ title: "Success", description: "Template saved." });
  };

  const deleteTemplate = (templateId: string) => {
    const newTemplates = templates.filter(t => t.id !== templateId);
    setTemplates(newTemplates);
    localStorage.setItem('clockify_templates_v2', JSON.stringify(newTemplates));
    toast({ title: "Success", description: "Template deleted." });
  };

  const applyTemplate = useCallback(async (templateId: string, dates: Date[]) => {
    const template = templates.find(t => t.id === templateId);
    if (!template || !isConfigured || dates.length === 0) return;

    setLoading(prev => ({ ...prev, [`applyTemplate-${templateId}`]: true }));
    let successCount = 0;
    let errorCount = 0;

    for (const date of dates) {
        for (const entry of template.entries) {
            const [startHours, startMinutes] = entry.startTime.split(':').map(Number);
            const [endHours, endMinutes] = entry.endTime.split(':').map(Number);
            
            const startDate = new Date(date);
            startDate.setHours(startHours, startMinutes, 0, 0);

            const endDate = new Date(date);
            endDate.setHours(endHours, endMinutes, 0, 0);
            
            const payload: TimeEntryRequest = {
                projectId: entry.projectId,
                taskId: entry.taskId,
                description: entry.description,
                start: startDate.toISOString(),
                end: endDate.toISOString(),
                billable: entry.billable
            };

            try {
                await apiFetch(`/workspaces/${workspaceId}/time-entries`, {
                    method: 'POST',
                    body: JSON.stringify(payload),
                });
                successCount++;
            } catch (e) {
                console.error(`Failed to create entry for ${entry.description} on ${date.toLocaleDateString()}`, e);
                errorCount++;
            }
        }
    }
    
    setLoading(prev => ({ ...prev, [`applyTemplate-${templateId}`]: false }));
    toast({
        title: "Template Applied",
        description: `${successCount} entries created across ${dates.length} day(s). ${errorCount > 0 ? `${errorCount} failed.` : ''}`
    });
    fetchTimeEntries();
}, [templates, isConfigured, apiFetch, workspaceId, toast, fetchTimeEntries]);

  useEffect(() => {
    if (isConfigured) {
      fetchCurrentUser();
    }
  }, [isConfigured, fetchCurrentUser]);

  const value = {
    apiKey,
    workspaceId,
    setCredentials,
    isConfigured,
    user,
    projects,
    timeEntries,
    templates,
    fetchProjects,
    fetchTasks,
    fetchTimeEntries,
    createTimeEntry,
    updateTimeEntry,
    deleteTimeEntry,
    loading,
    error,
    sheetOpen,
    setSheetOpen,
    sheetEntry,
    saveTemplate,
    deleteTemplate,
    applyTemplate,
  };

  return <ClockifyContext.Provider value={value}>{children}</ClockifyContext.Provider>;
};

export const useClockify = (): ClockifyContextType => {
  const context = useContext(ClockifyContext);
  if (context === undefined) {
    throw new Error('useClockify must be used within a ClockifyProvider');
  }
  return context;
};
