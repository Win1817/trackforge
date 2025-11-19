'use client';

import type { ColumnDef } from '@tanstack/react-table';
import type { TimeEntry } from '@/lib/types';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
  } from '@/components/ui/dropdown-menu';
import { MoreHorizontal, ArrowUpDown } from 'lucide-react';
import { formatDuration } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { useClockify } from '@/hooks/use-clockify';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '../ui/alert-dialog';

export const getColumns = (
    setSheetOpen: (open: boolean, entry: TimeEntry) => void,
    deleteTimeEntry: (id: string) => Promise<boolean>
  ): ColumnDef<TimeEntry>[] => [
    {
        accessorKey: 'project.name',
        header: 'Project',
        cell: ({ row }) => {
            const project = row.original.project;
            return project ? <div style={{color: project.color}} className="font-medium">{project.name}</div> : <span className="text-muted-foreground">No Project</span>;
        }
    },
    {
        accessorKey: 'task.name',
        header: 'Task',
        cell: ({ row }) => {
            const taskName = row.original.task?.name;
            return taskName ? <div>{taskName}</div> : <span className="text-muted-foreground">-</span>;
        }
    },
    {
        accessorKey: 'description',
        header: 'Description',
        cell: ({ row }) => <div className="max-w-xs truncate">{row.original.description || '-'}</div>,
    },
    {
        accessorKey: 'timeInterval.start',
        header: ({ column }) => {
            return (
              <Button
                variant="ghost"
                onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
              >
                Start Time
                <ArrowUpDown className="ml-2 h-4 w-4" />
              </Button>
            )
        },
        cell: ({ row }) => new Date(row.original.timeInterval.start).toLocaleString(),
        sortingFn: 'datetime',
    },
    {
        accessorKey: 'timeInterval.end',
        header: 'End Time',
        cell: ({ row }) => row.original.timeInterval.end ? new Date(row.original.timeInterval.end).toLocaleString() : '-',
    },
    {
        accessorKey: 'timeInterval.duration',
        header: 'Duration',
        cell: ({ row }) => formatDuration(row.original.timeInterval.start, row.original.timeInterval.end),
    },
    {
        accessorKey: 'billable',
        header: 'Billable',
        cell: ({ row }) => (row.original.billable ? <Badge>Yes</Badge> : <Badge variant="secondary">No</Badge>),
    },
    {
        id: 'actions',
        cell: ({ row }) => {
            const entry = row.original;
      
            return (
              <AlertDialog>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-8 w-8 p-0">
                      <span className="sr-only">Open menu</span>
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                    <DropdownMenuItem onClick={() => navigator.clipboard.writeText(entry.id)}>
                      Copy Entry ID
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => setSheetOpen(true, entry)}>Edit</DropdownMenuItem>
                    <AlertDialogTrigger asChild>
                      <DropdownMenuItem className="text-red-600 focus:text-red-600 focus:bg-red-50 dark:focus:bg-red-900/40">Delete</DropdownMenuItem>
                    </AlertDialogTrigger>
                  </DropdownMenuContent>
                </DropdownMenu>

                <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                      <AlertDialogDescription>
                        This action cannot be undone. This will permanently delete this time entry.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction className="bg-destructive text-destructive-foreground hover:bg-destructive/90" onClick={() => deleteTimeEntry(entry.id)}>Delete</AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
            );
          },
    }
];
