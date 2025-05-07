/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useRouter } from "next/navigation";
import { DocumentEntry } from "@/lib/data";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch"; // Add this import

import ImageUpload from "../ImageUpload";
import {
  useCreateDocumentMutation,
  useGetDocumentCountQuery,
  useUpdateDocumentMutation,
} from "@/redux/api/baseApi";
import { toast } from "sonner";
import { useAppSelector } from "@/redux/hooks";

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
  const [dholilNo, setDholilNo] = useState("");
  const selectedYear = useAppSelector((state) => state.documents.selectedYear);
  const { data } = useGetDocumentCountQuery(selectedYear);
  console.log(selectedYear, "selectedYear");
  console.log(data?.data, "data");
  // State for uploaded images from Cloudinary
  const [uploadedImages, setUploadedImages] = useState(
    initialData?.images ? initialData.images : []
  );

  // Add state for dholilNo toggle
  const [isDholilEnabled, setIsDholilEnabled] = useState(false);

  console.log(initialData?.dholilNo || data?.data + 1 || "", "dholilNo");

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setValue, // Get setValue from useForm
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      balamNo: initialData?.balamNo || "",
      pageNo: initialData?.pageNo || "",
      dholilNo: dholilNo,
      year:
        initialData?.year?.toString() ||
        (selectedYear && !isNaN(Number(selectedYear))
          ? selectedYear.toString()
          : ""),
      images: initialData?.images || [],
    },
  });

// Update the form value when dholilNo changes
useEffect(() => {
  if (isEditing && initialData) {
    setDholilNo(initialData?.dholilNo || String(data?.data + 1) || "");
    setValue("dholilNo", initialData?.dholilNo || String(data?.data + 1) || "");
  } else {
    setDholilNo(String(data?.data + 1) || "");
    setValue("dholilNo", String(data?.data + 1) || "");
  }
}, [isEditing, initialData, data?.data, setValue]);
  console.log(typeof dholilNo, "dholilNo type");
  console.log(dholilNo, "dholilNo");

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
        window.location.href = `/year/${data.year}`;
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
        console.log(newDocument);

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
          <div className="flex items-center justify-between">
            <Label htmlFor="dholilNo">Dholil No</Label>
            <div className="flex items-center space-x-2">
              <Label htmlFor="dholil-toggle" className="text-sm">
                {isDholilEnabled ? "Enabled" : "Disabled"}
              </Label>
              <Switch
                className=""
                id="dholil-toggle"
                checked={isDholilEnabled}
                onCheckedChange={setIsDholilEnabled}
              />
            </div>
          </div>
          <Input
            id="dholilNo"
            placeholder="Enter a dholil number"
            defaultValue={
              dholilNo || initialData?.dholilNo || String(data?.data + 1) || ""
            }
            {...register("dholilNo")}
            readOnly={!isDholilEnabled}
            className={!isDholilEnabled ? "bg-gray-100 text-gray-500" : ""}
          />
          {errors.balamNo && (
            <p className="text-sm text-red-500">{errors.balamNo.message}</p>
          )}
        </div>
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
          onClick={() => console.log("Button clicked")}
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
function setValue(arg0: string, arg1: string) {
  throw new Error("Function not implemented.");
}

