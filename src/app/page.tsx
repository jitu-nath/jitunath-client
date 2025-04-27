import { MainLayout } from '@/components/layout/main-layout';
import { DocumentTable } from '@/components/documents/document-table';

export default function Home() {
  return (
    <MainLayout title="All Data " showAddButton>
      <DocumentTable />
    </MainLayout>
  );
}