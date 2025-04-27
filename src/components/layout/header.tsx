'use client';


import { Button } from '@/components/ui/button';
import { ChevronLeft, Plus } from 'lucide-react';
import { useRouter, usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';

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
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    // Initial check
    checkIfMobile();

    // Add event listener
    window.addEventListener("resize", checkIfMobile);

    // Clean up
    return () => window.removeEventListener("resize", checkIfMobile);
  }, []);
  
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
              
             {isMobile || `Add New ` }
            </Button>
          )}
          
     
        </div>
      </div>
    </header>
  );
}