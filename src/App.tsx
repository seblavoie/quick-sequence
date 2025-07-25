import React from "react";
import { Controls } from "./components/Controls";
import { ImageList } from "./components/ImageList";
import { ImageUpload } from "./components/ImageUpload";
import { VideoPreview } from "./components/VideoPreview";

export const App: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="container mx-auto px-4 py-8">
        <header className="mb-12 text-center py-16">
          <h1 className="text-5xl md:text-6xl font-extrabold bg-gradient-to-r from-gray-900 via-indigo-900 to-purple-900 bg-clip-text text-transparent mb-4">
            Quick Stitch
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
            <span className="block">
              Image sequences to featherweight videos.{" "}
            </span>
            <span className="text-indigo-600 font-semibold">
              Drag, drop, export.
            </span>
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
