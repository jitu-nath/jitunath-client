"use client";

import { useParams } from "next/navigation";
import { MainLayout } from "@/components/layout/main-layout";
import { DocumentForm } from "@/components/documents/document-form";
import { useEffect, useState } from "react";
import { DocumentEntry } from "@/lib/data";
import { useGetSingleDocumentQuery } from "@/redux/api/baseApi";

export default function EditDocumentPage() {
  const params = useParams();
  const id = params.id as string;

  const [document, setDocument] = useState<DocumentEntry | undefined>(
    undefined
  );
  const { data, isLoading } = useGetSingleDocumentQuery(id);
  const documentData = data?.data;

  useEffect(() => {
    setDocument(documentData);
  }, [id, documentData]);
  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!document) {
    return (
      <MainLayout title="Document Not Found" showBackButton>
        <div className="flex flex-col items-center justify-center h-[50vh]">
          <h2 className="text-2xl font-bold">Document Not Found</h2>
          <p className="text-gray-500 dark:text-gray-400 mt-2">
            The document you are looking for does not exist.
          </p>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout title="Edit Data" showBackButton>
      <div className="max-w-4xl mx-auto bg-white dark:bg-gray-900 p-6 rounded-lg shadow-sm">
        <DocumentForm initialData={document} isEditing />
      </div>
    </MainLayout>
  );
}
