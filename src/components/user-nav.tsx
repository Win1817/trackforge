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
import { useRouter } from 'next/navigation';
import { useMemo, useState } from 'react';
import { GuideDialog } from './support/guide-dialog';

export function UserNav() {
  const { user, isConfigured, setCredentials } = useClockify();
  const router = useRouter();
  const [guideOpen, setGuideOpen] = useState(false);

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
    const settingsTrigger = document.querySelector('button[data-radix-collection-item][value="settings"]');
    if (settingsTrigger instanceof HTMLElement) {
      settingsTrigger.click();
    }
  }

  const handleLogout = () => {
    setCredentials(null, null);
    router.push('/login');
  };

  return (
    <>
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-10 w-10 rounded-full">
          <Avatar className="h-10 w-10">
            {isConfigured && user?.profilePicture ? <AvatarImage src={user.profilePicture} alt={user.name || 'User'} /> : null }
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
        <DropdownMenuItem onClick={() => setGuideOpen(true)} className="cursor-pointer">
          <LifeBuoy className="mr-2" />
          <span>Support</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleLogout} className="cursor-pointer">
          <LogOut className="mr-2" />
          <span>Log out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
    <GuideDialog open={guideOpen} onOpenChange={setGuideOpen} />
    </>
  );
}
