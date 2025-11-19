export interface ClockifyUser {
    id: string;
    email: string;
    name: string;
    memberships: any[];
    profilePicture: string;
    activeWorkspace: string;
    defaultWorkspace: string;
}
  
export interface Project {
    id: string;
    name: string;
    hourlyRate: any;
    clientId: string;
    workspaceId: string;
    billable: boolean;
    memberships: any[];
    color: string;
    archived: boolean;
    note: string;
    clientName: string;
    public: boolean;
}
  
export interface Task {
    id: string;
    name: string;
    projectId: string;
    assigneeIds: string[];
    estimate: string;
    status: string;
    duration: any;
    billable: boolean;
}
  
export interface TimeEntry {
    id: string;
    description: string;
    userId: string;
    billable: boolean;
    taskId?: string;
    projectId?: string;
    timeInterval: {
      start: string;
      end: string;
      duration: string;
    };
    workspaceId: string;
    project?: Project;
    task?: Task;
}
  
export interface TimeEntryRequest {
    start: string;
    end?: string;
    billable: boolean;
    description: string;
    projectId: string;
    taskId?: string;
}

export interface TemplateEntry {
    id: string;
    projectId: string;
    taskId?: string;
    description: string;
    startTime: string; // "HH:mm"
    endTime: string; // "HH:mm"
    billable: boolean;
}

export interface Template {
    id: string;
    name: string;
    entries: TemplateEntry[];
}