/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useAppSelector, useAppDispatch } from "@/redux/hooks";
import { setCurrentPage } from "@/redux/slices/documentSlice";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Pencil,
  Trash2,
  Search,
  ChevronLeft,
  ChevronRight,
  FileText,
  BookOpen,
  Calendar,
  Image as ImageIcon,
  Plus,
} from "lucide-react";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  useDeleteDocumentMutation,
  useGetDocumentsQuery,
} from "@/redux/api/baseApi";
import { ImageCarousel } from "../imageCarousel";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "sonner";

export function DocumentTable() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  let selectedYear = useAppSelector((state) => state.documents.selectedYear);
  const currentPage = useAppSelector((state) => state.documents.currentPage);
  const [deleteDocumentMutation] = useDeleteDocumentMutation();
  const itemsPerPage = useAppSelector((state) => state.documents.itemsPerPage);
  const { data, isLoading, refetch } = useGetDocumentsQuery("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [deleteId, setDeleteId] = useState<any>(null);
  const [images, setImages] = useState<any>([]);
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

  if (isLoading) return <div>Loading...</div>;
  const documents = data.data;

  selectedYear = Number(selectedYear);
  // Filter documents by year if selected
  const filteredByYear = selectedYear
    ? documents.filter((doc: any) => doc.year === selectedYear)
    : documents;

  // Filter by search term
  const allFilteredDocuments = searchTerm
    ? filteredByYear.filter((doc: any) =>
        doc.dholilNo.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : filteredByYear;


  const filteredDocuments = [...allFilteredDocuments].sort((a: any, b: any) => {
    const numA = Number(a.dholilNo);
    const numB = Number(b.dholilNo);

    const isNaA = isNaN(numA);
    const isNaB = isNaN(numB);

    if (isNaA && isNaB) return 0; // both invalid
    if (isNaA) return 1; // a is invalid, b is valid => b comes first
    if (isNaB) return -1; // b is invalid, a is valid => a comes first

    return numA - numB; // both valid, sort numerically
  });

  // Pagination
  const totalPages = Math.ceil(filteredDocuments.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedDocuments = filteredDocuments.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  const handlePageChange = (page: number) => {
    dispatch(setCurrentPage(page));
  };

  const handleEdit = (id: string) => {
    router.push(`/edit/${id}`);
  };

  const handleDelete = async (id: string) => {
    setDeleteId(id);
    console.log(id, "delete id");
  };

  const confirmDelete = async () => {
    if (deleteId) {
      setDeleteId(null);

      const res: any = await deleteDocumentMutation(deleteId);

      console.log(res, "delete res");
      if (res?.error) {
        toast.error("Failed to delete document");
      }
      if (res?.data?.success) {
        toast.success("Document deleted successfully");

        refetch();
      }
    }
  };
  const onAddClick =()=>{
    router.push('/add')
  }

  const cancelDelete = () => {
    setDeleteId(null);
  };

  const handleViewImages = (docImages: any[]) => {
    setIsModalOpen(true);
    setImages(docImages);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500 dark:text-gray-400" />
          <Input
            type="search"
            placeholder="Search..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              dispatch(setCurrentPage(1));
            }}
          />
        </div>
        <div className="flex items-center gap-4">
          {isMobile && (
            <Button onClick={onAddClick} className="gap-1">
              Add New
              <Plus className="h-4 w-4" />
              
             {isMobile || `Add New ` }
            </Button>
          )}
          
     
        </div>
      </div>

      {/* Desktop Table View */}
      {!isMobile && (
        <div className="rounded-md border bg-white dark:bg-gray-900 overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Dholil No</TableHead>
                <TableHead>Balam No</TableHead>
                <TableHead>Page No</TableHead>
                <TableHead>Year</TableHead>
                <TableHead>Image</TableHead>
                <TableHead className="text-right">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedDocuments.length > 0 ? (
                paginatedDocuments.map((doc: any) => (
                  <TableRow key={doc._id}>
                    <TableCell>{doc.dholilNo}</TableCell>
                    <TableCell>{doc.balamNo}</TableCell>
                    <TableCell>{doc.pageNo}</TableCell>
                    <TableCell>{doc.year}</TableCell>
                    <TableCell>
                      {doc?.images?.length > 0 ? (
                        <div>
                          <p
                            onClick={() => handleViewImages(doc.images)}
                            className="px-1 rounded-lg transition-colors cursor-pointer font-bold underline hover:text-blue-500 text-blue-700"
                          >
                            View Image
                          </p>
                        </div>
                      ) : (
                        <p>No Image</p>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="secondary"
                          size="sm"
                          className="h-8 px-2"
                          onClick={() => handleEdit(doc._id)}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          className="h-8 px-2"
                          onClick={() => handleDelete(doc._id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8">
                    No documents found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      )}

      {/* Mobile Card View */}
      {isMobile && (
        <div className="space-y-4">
          {paginatedDocuments.length > 0 ? (
            paginatedDocuments.map((doc: any) => (
              <Card key={doc._id} className="overflow-hidden">
                <CardContent className="p-4">
                  <div className="flex flex-col space-y-3">
                    <div className="flex items-center gap-2">
                      <FileText className="h-4 w-4 text-gray-500" />
                      <span className="font-medium">Dholil No:</span>
                      <span>{doc.dholilNo}</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <BookOpen className="h-4 w-4 text-gray-500" />
                      <span className="font-medium">Balam No:</span>
                      <span>{doc.balamNo}</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <BookOpen className="h-4 w-4 text-gray-500" />
                      <span className="font-medium">Page No:</span>
                      <span>{doc.pageNo}</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-gray-500" />
                      <span className="font-medium">Year:</span>
                      <span>{doc.year}</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <ImageIcon className="h-4 w-4 text-gray-500" />
                      <span className="font-medium">Images:</span>
                      {doc?.images?.length > 0 ? (
                        <span
                          onClick={() => handleViewImages(doc.images)}
                          className="px-1 rounded-lg transition-colors cursor-pointer font-bold underline hover:text-blue-500 text-blue-700"
                        >
                          View Images
                        </span>
                      ) : (
                        <span>No Images</span>
                      )}
                    </div>

                    <div className="flex gap-2 pt-2">
                      <Button
                        variant="secondary"
                        className="flex-1"
                        onClick={() => handleEdit(doc._id)}
                      >
                        <Pencil className="h-4 w-4 mr-2" />
                        Edit
                      </Button>
                      <Button
                        variant="destructive"
                        className="flex-1"
                        onClick={() => handleDelete(doc._id)}
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Delete
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <div className="text-center p-8 border rounded-md">
              No documents found
            </div>
          )}
        </div>
      )}

      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-500 dark:text-gray-400">
            Page {currentPage} of {totalPages}
          </div>
          <div className="flex items-center gap-1">
            <Button
              variant="outline"
              size="icon"
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>

            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              // Show pages around current page
              let pageNum;
              if (totalPages <= 5) {
                pageNum = i + 1;
              } else if (currentPage <= 3) {
                pageNum = i + 1;
              } else if (currentPage >= totalPages - 2) {
                pageNum = totalPages - 4 + i;
              } else {
                pageNum = currentPage - 2 + i;
              }

              return (
                <Button
                  key={pageNum}
                  variant={currentPage === pageNum ? "default" : "outline"}
                  size="icon"
                  onClick={() => handlePageChange(pageNum)}
                  className="w-8 h-8"
                >
                  {pageNum}
                </Button>
              );
            })}

            <Button
              variant="outline"
              size="icon"
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}

      <ImageCarousel
        images={images}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />

      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent className="bg-white text-black">
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Data</AlertDialogTitle>
            <AlertDialogDescription>
              Are You Sure You Want To Delete Data?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={cancelDelete}>
              No, I Don&apos;t
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              className="bg-red-500 text-white hover:bg-red-600"
            >
              Yes I&apos;m Sure
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
