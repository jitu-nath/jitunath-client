'use client';


import { Button } from '@/components/ui/button';
import { ChevronLeft } from 'lucide-react';
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

}: HeaderProps) {
  const router = useRouter();
  const pathname = usePathname();






  
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
        
     
      </div>
    </header>
  );
}