import React, { useState } from "react";
import { ChevronLeft, ChevronRight, Download, X } from "lucide-react";
import Image from "next/image";

interface ImageCarouselProps {
  images: string[];
  isOpen: boolean;
  onClose: () => void;
}

export function ImageCarousel({ images, isOpen, onClose }: ImageCarouselProps) {
  console.log(images);
  const [currentIndex, setCurrentIndex] = useState(0);

  if (!isOpen) return null;

  const handlePrevious = () => {
    setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };
  const handleDownload = async () => {
    try {
      const imageUrl = images[currentIndex];
      const response = await fetch(imageUrl);

      if (!response.ok) throw new Error("Failed to fetch image.");

      const blob = await response.blob();
      const downloadUrl = URL.createObjectURL(blob);

      // Create a link for downloading
      const link = document.createElement("a");
      link.href = downloadUrl;
      link.download = `image-${currentIndex + 1}.png`; // You can customize the filename here

      // Trigger download
      document.body.appendChild(link);
      link.click();

      // Clean up
      document.body.removeChild(link);
      URL.revokeObjectURL(downloadUrl);
    } catch (error) {
      console.error("Error downloading image:", error);
      alert("Failed to download image. Please try again.");
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="relative bg-white rounded-lg max-w-4xl w-full mx-4">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-gray-500 hover:text-gray-700 z-10"
        >
          <X size={24} />
        </button>

        <div className="relative aspect-video">
          <Image
            src={images[currentIndex]}
            alt={`Image ${currentIndex + 1}`}
            width={800}
            height={600}
            className="w-full h-full object-contain"
          />

          <button
            onClick={handlePrevious}
            className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/80 p-2 rounded-full hover:bg-white"
          >
            <ChevronLeft size={24} />
          </button>

          <button
            onClick={handleNext}
            className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/80 p-2 rounded-full hover:bg-white"
          >
            <ChevronRight size={24} />
          </button>
        </div>

        <div className="p-4 border-t flex items-center justify-between">
          <div className="text-sm text-gray-500">
            Image {currentIndex + 1} of {images.length}
          </div>

          <button
            onClick={handleDownload}
            className="flex items-center gap-2 bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-colors"
          >
            <Download size={18} />
            Download
          </button>
        </div>
      </div>
    </div>
  );
}
