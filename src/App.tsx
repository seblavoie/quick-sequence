import React from "react";
import { Controls } from "./components/Controls";
import { ImageList } from "./components/ImageList";
import { ImageUpload } from "./components/ImageUpload";
import { VideoPreview } from "./components/VideoPreview";

export const App: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-100">
      <div className="container mx-auto px-4 py-8">
        <header className="mb-8 text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Quick Stitch
          </h1>
          <p className="text-gray-600">
            Create video slideshows from images with drag & drop simplicity
          </p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column - Image Upload and List */}
          <div className="space-y-6">
            <ImageUpload />
            <ImageList />
          </div>

          {/* Right Column - Preview and Controls */}
          <div className="space-y-6">
            <VideoPreview />
            <Controls />
          </div>
        </div>
      </div>
    </div>
  );
};
