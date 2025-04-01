'use client';


import { useParams } from 'next/navigation';
import { useEffect } from 'react';
import { useAppDispatch } from '@/redux/hooks';
import { setSelectedYear } from '@/redux/slices/documentSlice';
import { MainLayout } from '@/components/layout/main-layout';
import { DocumentTable } from '@/components/documents/document-table';

export default function YearPage() {
  const params = useParams();
  console.log("params",params);

  const year = params.year as string;
  console.log(year);
  const dispatch = useAppDispatch();
  
  useEffect(() => {
    dispatch(setSelectedYear(year));
  }, [year, dispatch]);
  
  return (
    <MainLayout title={year} showBackButton showAddButton>
      <DocumentTable />
    </MainLayout>
  );
}