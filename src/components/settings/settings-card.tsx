'use client';


import { ChevronRight } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface SettingsCardProps {
  title: string;
  path: string;
}

export function SettingsCard({ title, path }: SettingsCardProps) {
  const router = useRouter();
  
  return (
    <div 
      className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-800 rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-900"
      onClick={() => router.push(path)}
    >
      <h3 className="text-base font-medium">{title}</h3>
      <ChevronRight className="h-5 w-5 text-gray-400" />
    </div>
  );
}