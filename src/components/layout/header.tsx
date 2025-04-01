'use client';

import { useAppSelector } from '@/redux/hooks';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { ChevronLeft, Plus } from 'lucide-react';
import { useRouter, usePathname } from 'next/navigation';

interface HeaderProps {
  title: string;
  showBackButton?: boolean;
  showAddButton?: boolean;
  onAddClick?: () => void;
}

export function Header({ 
  title, 
  showBackButton = false, 
  showAddButton = false,
  onAddClick
}: HeaderProps) {
  const router = useRouter();
  const pathname = usePathname();
  const user = useAppSelector((state) => state.user.currentUser);
  
  const handleBack = () => {
    if (pathname.includes('/add')) {
      router.push('/');
    } else if (pathname.includes('/edit')) {
      router.push('/');
    } else {
      router.back();
    }
  };

  return (
    <header className="border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          {showBackButton && (
            <Button variant="ghost" size="icon" onClick={handleBack}>
              <ChevronLeft className="h-5 w-5" />
            </Button>
          )}
          <h1 className="text-xl font-semibold">{title}</h1>
        </div>
        
        <div className="flex items-center gap-4">
          {showAddButton && (
            <Button onClick={onAddClick} className="gap-1">
              <Plus className="h-4 w-4" />
              Add New
            </Button>
          )}
          
          {user && (
            <div className="flex items-center gap-2">
              <div className="text-right mr-2">
                <p className="text-sm font-medium">Welcome, {user.name}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">Have a nice day</p>
              </div>
              <Avatar>
                <AvatarImage src={user.avatar} alt={user.name} />
                <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
              </Avatar>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}