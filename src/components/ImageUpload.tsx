/* eslint-disable @typescript-eslint/no-explicit-any */

import Image from "next/image";
import React, { useState, useRef, useEffect } from "react";

interface UploadedImage {
  public_id: string;
  url: string;
  width: number;
  height: number;
}

interface ImageUploadProps {
  onUpload?: (images: UploadedImage[]) => void;
  maxImages?: number;
  initialImages?: any[];
}

const ImageUpload: React.FC<ImageUploadProps> = ({
  onUpload,
  maxImages = 8,
  initialImages = [],
}) => {
  const [previews, setPreviews] = useState<string[]>([]);
  const [uploadedImages, setUploadedImages] = useState(initialImages);
  const [error, setError] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Clear error after 5 seconds
  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => setError(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  // Generate previews from initial images
  useEffect(() => {
    if (initialImages && initialImages.length > 0) {
      const initialPreviews = initialImages.map((img) => img);
      setPreviews(initialPreviews);
    }
  }, [initialImages]);

  const uploadToCloudinary = async (files: File[]) => {
    setIsUploading(true);
    try {
      const formData = new FormData();
      files.forEach((file) => {
        formData.append("files", file);
      });

      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Upload failed");
      }

      const data = await response.json();
      return data.images as UploadedImage[];
    } catch (err) {
      setError("Failed to upload images. Please try again.");
      console.error("Upload error:", err);
      return [];
    } finally {
      setIsUploading(false);
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.length) return;

    const newFiles = Array.from(e.target.files);

    // Check if adding these files would exceed the limit
    if (uploadedImages.length + newFiles.length > maxImages) {
      setError(
        `You can upload a maximum of ${maxImages} images. (${uploadedImages.length}/${maxImages} already uploaded)`
      );
      return;
    }

    // Create temporary preview URLs
    const newFilePreviews = newFiles.map((file) => URL.createObjectURL(file));

    // Create temporary previews for all images
    const tempPreviews = [...previews, ...newFilePreviews];
    setPreviews(tempPreviews);

    // Upload new files to Cloudinary
    const cloudinaryImages = await uploadToCloudinary(newFiles);

    if (cloudinaryImages.length > 0) {
      // Update uploaded images state
      const updatedImages = [...uploadedImages, ...cloudinaryImages];
      setUploadedImages(updatedImages);

      // Revoke temporary object URLs to prevent memory leaks
      newFilePreviews.forEach((url) => URL.revokeObjectURL(url));

      // Update previews with actual Cloudinary URLs
      const updatedPreviews = updatedImages.map((img) => img.url);
      setPreviews(updatedPreviews);

      if (onUpload) {
        onUpload(updatedImages);
      }
    } else {
      // Revert to previous state if upload failed
      setPreviews(previews);
    }
  };

  const removeImage = (index: number) => {
    const updatedImages = [...uploadedImages];
    const updatedPreviews = [...previews];

    updatedImages.splice(index, 1);
    updatedPreviews.splice(index, 1);

    setUploadedImages(updatedImages);
    setPreviews(updatedPreviews);

    if (onUpload) {
      onUpload(updatedImages);
    }

    if (error) setError(null);
  };

  const addMoreImages = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  return (
    <div className="w-full">
      {error && (
        <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg flex items-center justify-between animate-pulse">
          <span>{error}</span>
          <button
            onClick={() => setError(null)}
            className="text-red-700 hover:text-red-900"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
      )}
      <div className="mb-5">
        <label
          className={`flex flex-col items-center justify-center w-full h-36 border-2 border-dashed ${
            isDragging
              ? "border-blue-500 bg-blue-50"
              : isUploading
              ? "border-yellow-300 bg-yellow-50"
              : "border-blue-300 bg-gradient-to-br from-white to-blue-50 hover:from-blue-50 hover:to-white"
          } rounded-xl cursor-pointer transition-all duration-300 shadow-sm ${
            isUploading ? "cursor-wait" : ""
          }`}
          onDragOver={(e) => {
            e.preventDefault();
            e.stopPropagation();
            if (!isUploading) setIsDragging(true);
          }}
          onDragEnter={(e) => {
            e.preventDefault();
            e.stopPropagation();
            if (!isUploading) setIsDragging(true);
          }}
          onDragLeave={(e) => {
            e.preventDefault();
            e.stopPropagation();
            setIsDragging(false);
          }}
          onDrop={(e) => {
            e.preventDefault();
            e.stopPropagation();
            setIsDragging(false);

            if (isUploading) return;

            if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
              const files = Array.from(e.dataTransfer.files).filter((file) =>
                file.type.startsWith("image/")
              );

              if (files.length) {
                const event = {
                  target: { files: e.dataTransfer.files },
                } as React.ChangeEvent<HTMLInputElement>;
                handleFileChange(event);
              }
            }
          }}
        >
          <div className="flex flex-col items-center justify-center pt-5 pb-6">
            <div className="mb-3 p-3 rounded-full bg-blue-100">
              {isUploading ? (
                <svg
                  className="w-8 h-8 text-yellow-500 animate-spin"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
              ) : (
                <svg
                  className="w-8 h-8 text-blue-500"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 20 16"
                >
                  <path
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"
                  />
                </svg>
              )}
            </div>
            {isUploading ? (
              <p className="mb-2 text-sm text-yellow-700 font-semibold">
                Uploading images to Cloudinary...
              </p>
            ) : (
              <>
                <p className="mb-2 text-sm text-blue-700 font-semibold">
                  <span className="underline">Click to upload</span> or drag and
                  drop
                </p>
                <p className="text-xs text-blue-500">PNG, JPG or JPEG</p>
              </>
            )}
            <p className="text-xs mt-1 text-blue-400 font-medium">
              {uploadedImages.length}/{maxImages} images uploaded
            </p>
          </div>
          <input
            ref={fileInputRef}
            id="dropzone-file"
            type="file"
            className="hidden"
            accept="image/*"
            multiple
            onChange={handleFileChange}
            disabled={isUploading}
          />
        </label>
      </div>

      {previews.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-5">
          {previews.map((preview, index) => (
            <div
              key={index}
              className="relative group overflow-hidden rounded-xl shadow-md border border-blue-100 transition-transform duration-300 hover:scale-105"
            >
              <div className="aspect-square overflow-hidden">
                <Image
                  width={300}
                  height={300}
                  src={preview}
                  alt={`Preview ${index + 1}`}
                  className="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
                />
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end">
                <div className="p-3 w-full">
                  <button
                    type="button"
                    onClick={() => removeImage(index)}
                    className="bg-red-500 text-white rounded-full p-1.5 hover:bg-red-600 transition-colors shadow-lg float-right"
                    disabled={isUploading}
                  >
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {uploadedImages.length > 0 && uploadedImages.length < maxImages && (
        <button
          type="button"
          onClick={addMoreImages}
          className="py-2.5 px-5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-md flex items-center justify-center gap-2 mx-auto"
          disabled={isUploading}
        >
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 6v6m0 0v6m0-6h6m-6 0H6"
            />
          </svg>
          Add More Images ({uploadedImages.length}/{maxImages})
        </button>
      )}
    </div>
  );
};

export default ImageUpload;
