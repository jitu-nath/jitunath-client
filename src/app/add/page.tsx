'use client';

import { MainLayout } from '@/components/layout/main-layout';
import { DocumentForm } from '@/components/documents/document-form';

export default function AddDocumentPage() {
  return (
    <MainLayout title="Add Data" showBackButton>
      <div className="max-w-4xl mx-auto bg-white dark:bg-gray-900 p-6 rounded-lg shadow-sm">
        <DocumentForm />
      </div>
    </MainLayout>
  );
}