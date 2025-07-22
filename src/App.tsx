import { Camera, Clock, Film, Trash2, Zap } from "lucide-react";
import React from "react";
import { Controls } from "./components/Controls";
import { ImageList } from "./components/ImageList";
import { ImageUpload } from "./components/ImageUpload";
import { Badge } from "./components/ui/badge";
import { Button } from "./components/ui/button";
import { Card, CardContent } from "./components/ui/card";
import { VideoPreview } from "./components/VideoPreview";
import { useImageStore } from "./store/useImageStore";

export const App: React.FC = () => {
  const { images, clearImages, fps } = useImageStore();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-6">
            <div className="flex items-center">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-600">
                <Zap className="h-6 w-6 text-white" />
              </div>
              <div className="ml-4">
                <h1 className="text-2xl font-bold text-gray-900">
                  Quick Stitch
                </h1>
                <p className="text-sm text-gray-500">
                  Create video slideshows from images
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <Badge variant="secondary" className="bg-gray-100 text-gray-700">
                <Camera className="mr-1 h-3 w-3" />
                {images.length} {images.length === 1 ? "image" : "images"}
              </Badge>
              <Badge variant="secondary" className="bg-gray-100 text-gray-700">
                <Film className="mr-1 h-3 w-3" />
                {fps} FPS
              </Badge>
              {images.length > 0 && (
                <Badge className="bg-indigo-100 text-indigo-700">
                  <Clock className="mr-1 h-3 w-3" />
                  {(images.length / fps).toFixed(1)}s duration
                </Badge>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
          {/* Left Column */}
          <div className="lg:col-span-8">
            <div className="space-y-8">
              {/* Upload Section */}
              <div>
                <div className="mb-4">
                  <h2 className="text-lg font-semibold text-gray-900">
                    Upload Images
                  </h2>
                  <p className="text-sm text-gray-600">
                    Add the images you want to include in your slideshow
                  </p>
                </div>
                <Card className="border-gray-200">
                  <CardContent className="p-6">
                    <ImageUpload />
                  </CardContent>
                </Card>
              </div>

              {/* Images Section */}
              <div>
                <div className="mb-4 flex items-center justify-between">
                  <div>
                    <h2 className="text-lg font-semibold text-gray-900">
                      Image Sequence
                    </h2>
                    <p className="text-sm text-gray-600">
                      Drag to reorder, click the trash icon to remove
                    </p>
                  </div>
                  {images.length > 0 && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={clearImages}
                      className="border-red-200 text-red-700 hover:bg-red-50 hover:border-red-300"
                    >
                      <Trash2 className="mr-2 h-4 w-4" />
                      Clear all
                    </Button>
                  )}
                </div>
                <Card className="border-gray-200">
                  <CardContent className="p-6">
                    <ImageList />
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="lg:col-span-4">
            <div className="space-y-8">
              <Controls />
              <VideoPreview />
            </div>
          </div>
        </div>

        {/* Help Section */}
        <div className="mt-16">
          <div className="mb-8 text-center">
            <h2 className="text-2xl font-bold text-gray-900">How it works</h2>
            <p className="mt-2 text-lg text-gray-600">
              Create professional video slideshows in just a few steps
            </p>
          </div>

          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            <div className="text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-lg bg-indigo-100">
                <span className="text-lg font-semibold text-indigo-600">1</span>
              </div>
              <h3 className="mt-4 text-lg font-semibold text-gray-900">
                Upload images
              </h3>
              <p className="mt-2 text-sm text-gray-600">
                Drag and drop your images or click to browse and select multiple
                files
              </p>
            </div>

            <div className="text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-lg bg-indigo-100">
                <span className="text-lg font-semibold text-indigo-600">2</span>
              </div>
              <h3 className="mt-4 text-lg font-semibold text-gray-900">
                Arrange sequence
              </h3>
              <p className="mt-2 text-sm text-gray-600">
                Drag the grip handle to reorder your images in the perfect
                sequence
              </p>
            </div>

            <div className="text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-lg bg-indigo-100">
                <span className="text-lg font-semibold text-indigo-600">3</span>
              </div>
              <h3 className="mt-4 text-lg font-semibold text-gray-900">
                Export video
              </h3>
              <p className="mt-2 text-sm text-gray-600">
                Adjust the frame rate and export your slideshow as an H.264
                video
              </p>
            </div>
          </div>
        </div>

        {/* Advanced Section */}
        <div className="mt-16">
          <Card className="border-gray-200 bg-gray-50">
            <CardContent className="p-8">
              <div className="text-center">
                <h3 className="text-lg font-semibold text-gray-900">
                  Need more control?
                </h3>
                <p className="mt-2 text-sm text-gray-600">
                  Use Remotion Studio for advanced editing capabilities, custom
                  transitions, and professional video production features.
                </p>
                <div className="mt-4">
                  <code className="rounded bg-gray-200 px-2 py-1 text-sm text-gray-800">
                    pnpm run dev
                  </code>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};
