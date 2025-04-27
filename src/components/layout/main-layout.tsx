'use client';

import { Sidebar } from './sidebar';
import { Header } from './header';
import { useRouter } from 'next/navigation';


interface MainLayoutProps {
  children: React.ReactNode;
  title: string;
  showBackButton?: boolean;
  showAddButton?: boolean;
}

export function MainLayout({ 
  children, 
  title, 
  showBackButton = false,
  showAddButton = false
}: MainLayoutProps) {
  const router = useRouter();
  
  const handleAddClick = () => {
    router.push('/add');
  };

  return (
    <div className="flex h-screen bg-gray-100 dark:bg-gray-950">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header 
          title={title} 
          showBackButton={showBackButton} 
          showAddButton={showAddButton}
          onAddClick={handleAddClick}
        />
        <main className="flex-1 overflow-auto p-6">
          <div className="mx-auto max-w-7xl">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}