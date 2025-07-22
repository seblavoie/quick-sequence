import { Image, Upload } from "lucide-react";
import React from "react";
import { useDropzone } from "react-dropzone";
import { cn } from "../lib/utils";
import { useImageStore } from "../store/useImageStore";
import { Badge } from "./ui/badge";

export const ImageUpload: React.FC = () => {
  const addImages = useImageStore((state) => state.addImages);

  const { getRootProps, getInputProps, isDragActive, isDragReject } =
    useDropzone({
      accept: {
        "image/*": [".jpeg", ".jpg", ".png", ".gif", ".bmp", ".webp"],
      },
      multiple: true,
      onDrop: (acceptedFiles) => {
        addImages(acceptedFiles);
      },
    });

  return (
    <div
      {...getRootProps()}
      className={cn(
        "relative cursor-pointer rounded-lg border-2 border-dashed p-8 text-center transition-colors duration-200",
        isDragActive && !isDragReject && "border-indigo-300 bg-indigo-50",
        isDragReject && "border-red-300 bg-red-50",
        !isDragActive && "border-gray-300 hover:border-gray-400",
      )}
    >
      <input {...getInputProps()} />

      <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-lg bg-gray-100">
        {isDragActive ? (
          <Upload className="h-6 w-6 text-gray-600" />
        ) : (
          <Image className="h-6 w-6 text-gray-600" />
        )}
      </div>

      <h3 className="mt-4 text-lg font-semibold text-gray-900">
        {isDragActive ? "Drop your images here" : "Upload images"}
      </h3>

      <p className="mt-2 text-sm text-gray-600">
        {isDragActive
          ? "Release to upload these images to your slideshow"
          : "Drag and drop images here, or click to browse and select files"}
      </p>

      <div className="mt-4 flex flex-wrap justify-center gap-2">
        {["JPEG", "PNG", "GIF", "WebP"].map((format) => (
          <Badge
            key={format}
            variant="secondary"
            className="bg-gray-100 text-gray-700 text-xs"
          >
            {format}
          </Badge>
        ))}
      </div>
    </div>
  );
};
