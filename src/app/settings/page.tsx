'use client';

import { MainLayout } from '@/components/layout/main-layout';
import { SettingsCard } from '@/components/settings/settings-card';

export default function SettingsPage() {
  return (
    <MainLayout title="Settings" showBackButton>
      <div className="max-w-2xl mx-auto bg-white dark:bg-gray-900 p-6 rounded-lg shadow-sm">
        <h2 className="text-xl font-semibold mb-6">Settings</h2>
        <div className="space-y-4">
       
          <SettingsCard 
            title="Change Password" 
            path="/settings/change-password" 
          />
        </div>
      </div>
    </MainLayout>
  );
}