'use client';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useClockify } from '@/hooks/use-clockify';
import { User, LifeBuoy, LogOut, Settings } from 'lucide-react';
import { useMemo } from 'react';

export function UserNav() {
  const { user, isConfigured, setSheetOpen } = useClockify();

  const userInitials = useMemo(() => {
    if (user?.name) {
      const names = user.name.split(' ');
      if (names.length > 1) {
        return `${names[0][0]}${names[names.length - 1][0]}`;
      }
      return names[0][0];
    }
    return '';
  }, [user?.name]);

  const handleSettingsClick = () => {
    // This is a workaround to navigate to the settings tab.
    // In a real SPA, you'd use a router or state management.
    const settingsTrigger = document.querySelector('button[data-radix-collection-item][value="settings"]');
    if (settingsTrigger instanceof HTMLElement) {
      settingsTrigger.click();
    }
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-10 w-10 rounded-full">
          <Avatar className="h-10 w-10">
            {isConfigured && user?.profilePicture && <AvatarImage src={user.profilePicture} alt={user.name} />}
            <AvatarFallback>
              {isConfigured && user ? userInitials : <User className="h-5 w-5" />}
            </AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        {isConfigured && user ? (
          <>
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium leading-none">{user.name}</p>
                <p className="text-xs leading-none text-muted-foreground">
                  {user.email}
                </p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
          </>
        ) : (
            <DropdownMenuLabel className="font-normal">
                <p className="text-sm leading-none text-muted-foreground">Not Connected</p>
            </DropdownMenuLabel>
        )}
        <DropdownMenuGroup>
          <DropdownMenuItem onClick={handleSettingsClick} className="cursor-pointer">
            <Settings className="mr-2" />
            <span>Settings</span>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem disabled>
          <LifeBuoy className="mr-2" />
          <span>Support</span>
        </DropdownMenuItem>
        <DropdownMenuItem disabled>
          <LogOut className="mr-2" />
          <span>Log out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
