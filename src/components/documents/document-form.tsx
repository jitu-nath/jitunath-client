/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useRouter } from "next/navigation";
import { DocumentEntry } from "@/lib/data";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import ImageUpload from "../ImageUpload";
import {
  useCreateDocumentMutation,
  useUpdateDocumentMutation,
} from "@/redux/api/baseApi";
import { toast } from "sonner";

// Define the UploadedImage interface
interface UploadedImage {
  public_id: string;
  url: string;
  width: number;
  height: number;
}

const formSchema = z.object({
  balamNo: z.string().min(1, { message: "BalamNo  is required" }),
  dholilNo: z.string().min(1, { message: "Dholil No is required" }),
  pageNo: z.string().min(1, { message: "Page No is required" }),
  // year: z.string().min(1, { message: "Year is required" }),
  year: z.union([
    z.string().min(1, { message: "Year is required" }),
    z.number().min(1, { message: "Year is required" }),
  ]),
  images: z.array(z.string()),
});

type FormValues = z.infer<typeof formSchema>;

interface DocumentFormProps {
  initialData?: DocumentEntry;
  isEditing?: boolean;
}

export function DocumentForm({ initialData, isEditing = false }: any) {
  const router = useRouter();
  // Convert year to string if initialData exists
  console.log({
    initialData,
    isEditing,
  });

  // State for uploaded images from Cloudinary
  const [uploadedImages, setUploadedImages] = useState(
    initialData?.images ? initialData.images : []
  );

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      balamNo: initialData?.balamNo || "",
      dholilNo: initialData?.dholilNo || "",
      pageNo: initialData?.pageNo || "",
      year: initialData?.year.toString() || new Date().getFullYear().toString(),
      images: initialData?.images || [],
    },
  });

  const [createDataHandle] = useCreateDocumentMutation();
  const [updateDataHandle] = useUpdateDocumentMutation();
  const handleImageUpload = (images: UploadedImage[]) => {
    setUploadedImages(images);
  };

  const onSubmit = async (data: FormValues) => {
    try {
      // Log the form data with images before submitting
      console.log({
        id: initialData?._id,
        ...data,
        year: Number(data.year),
        images: uploadedImages.map((image: any) => {
          if (typeof image === "string") {
            return image;
          }
          return image.url;
        }),
        // images:
        //   Array.isArray(uploadedImages) && typeof uploadedImages[0] === "string"
        //     ? uploadedImages
        //     : uploadedImages.map((image: any) => image.url),
      });
      if (isEditing && initialData) {
        const updatedData = await updateDataHandle({
          id: initialData._id,
          ...data,
          year: Number(data.year),
          images: uploadedImages.map((image: any) => {
            if (typeof image === "string") {
              return image;
            }
            return image.url;
          }),
        });
      } else {
        const newDocument = {
          ...data,
          year: Number(data.year),
          images:
            Array.isArray(uploadedImages) &&
            typeof uploadedImages[0] === "string"
              ? uploadedImages
              : uploadedImages.map((image: any) => image.url),
        };

        const submitData: any = await createDataHandle(newDocument);
        console.log(submitData);
        if (submitData?.error) {
          toast.error(submitData.error.data.message);
        } else {
          toast.success("Document created successfully");
          window.location.href = `/year/${data.year}`;
        }
      }
    } catch (error) {
      toast.error("Error occurred while saving data");
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="balamNo">Balam No</Label>
          <Input
            id="balamNo"
            placeholder="Enter a balam number"
            {...register("balamNo")}
          />
          {errors.balamNo && (
            <p className="text-sm text-red-500">{errors.balamNo.message}</p>
          )}
        </div>
        <div className="space-y-2">
          <Label htmlFor="dholilNo">Dholil No</Label>
          <Input
            id="dholilNo"
            placeholder="Enter a dholil number"
            {...register("dholilNo")}
          />
          {errors.dholilNo && (
            <p className="text-sm text-red-500">{errors.dholilNo.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="pageNo">Page No</Label>
          <Input
            id="pageNo"
            placeholder="Enter a page number"
            {...register("pageNo")}
          />
          {errors.pageNo && (
            <p className="text-sm text-red-500">{errors.pageNo.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="year">Year</Label>
          <Input id="year" placeholder="Enter a year" {...register("year")} />
          {errors.year && (
            <p className="text-sm text-red-500">{errors.year.message}</p>
          )}
        </div>
      </div>

      <div className="space-y-2">
        <Label>Upload Images</Label>
        <ImageUpload
          onUpload={handleImageUpload}
          initialImages={initialData?.images}
          maxImages={8}
        />
      </div>

      <div className="flex justify-end">
        <button
          type="submit"
          disabled={isSubmitting}
          className={`font-semibold py-2 px-4 rounded ${
            isSubmitting
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-blue-600 hover:bg-blue-700 text-white"
          }`}
        >
          {isSubmitting ? "Saving..." : isEditing ? "Save Changes" : "Save Now"}
        </button>
      </div>
    </form>
  );
}
