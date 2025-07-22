import { Monitor, Pause, Play, RotateCcw } from "lucide-react";
import React, { useEffect, useRef, useState } from "react";
import { useImageStore } from "../store/useImageStore";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Progress } from "./ui/progress";

export const VideoPreview: React.FC = () => {
  const { images, fps } = useImageStore();
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const frameDuration = 1000 / fps;

  useEffect(() => {
    setCurrentImageIndex(0);
    setProgress(0);

    if (images.length > 0) {
      setIsPlaying(true);
    } else {
      setIsPlaying(false);
    }
  }, [images]);

  useEffect(() => {
    if (isPlaying && images.length > 0) {
      intervalRef.current = setInterval(() => {
        setCurrentImageIndex((prevIndex) => {
          const nextIndex = (prevIndex + 1) % images.length;
          const newProgress = ((nextIndex + 1) / images.length) * 100;
          setProgress(nextIndex === 0 ? 0 : newProgress);
          return nextIndex;
        });
      }, frameDuration);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isPlaying, images.length, frameDuration]);

  useEffect(() => {
    if (images.length > 0) {
      const newProgress = ((currentImageIndex + 1) / images.length) * 100;
      setProgress(newProgress);
    }
  }, [currentImageIndex, images.length]);

  const togglePlayPause = () => {
    if (images.length === 0) return;
    setIsPlaying(!isPlaying);
  };

  const resetPreview = () => {
    setIsPlaying(false);
    setCurrentImageIndex(0);
    setProgress(0);
  };

  const currentImage = images[currentImageIndex];
  const totalDuration = images.length / fps;
  const currentTime = (currentImageIndex + 1) / fps;

  if (images.length === 0) {
    return (
      <Card className="border-gray-200">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center text-lg font-semibold text-gray-900">
            <Monitor className="mr-2 h-5 w-5 text-gray-600" />
            Preview
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex aspect-video items-center justify-center rounded-lg border-2 border-dashed border-gray-300 bg-gray-50">
            <div className="text-center">
              <Monitor className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-semibold text-gray-900">
                No preview available
              </h3>
              <p className="mt-1 text-sm text-gray-600">
                Add images to see your slideshow preview
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-gray-200">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center text-lg font-semibold text-gray-900">
            <Monitor className="mr-2 h-5 w-5 text-gray-600" />
            Preview
          </CardTitle>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={resetPreview}
              className="border-gray-300 text-gray-700 hover:bg-gray-50"
            >
              <RotateCcw className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={togglePlayPause}
              className="border-gray-300 text-gray-700 hover:bg-gray-50"
            >
              {isPlaying ? (
                <Pause className="h-4 w-4" />
              ) : (
                <Play className="h-4 w-4" />
              )}
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Video Player */}
        <div className="relative">
          <div className="aspect-video overflow-hidden rounded-lg bg-black">
            {currentImage && (
              <img
                src={currentImage.url}
                alt={currentImage.name}
                className="h-full w-full object-contain"
              />
            )}

            {/* Overlays */}
            <div className="absolute top-2 left-2">
              <Badge
                variant="secondary"
                className={`${isPlaying ? "bg-red-100 text-red-800" : "bg-gray-100 text-gray-800"} border-0`}
              >
                {isPlaying ? "LIVE" : "PAUSED"}
              </Badge>
            </div>

            <div className="absolute top-2 right-2">
              <Badge
                variant="secondary"
                className="bg-black/70 text-white border-0"
              >
                {currentImageIndex + 1} / {images.length}
              </Badge>
            </div>

            {/* Play overlay when paused */}
            {!isPlaying && (
              <div
                className="absolute inset-0 flex cursor-pointer items-center justify-center bg-black/50"
                onClick={togglePlayPause}
              >
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-white/90 hover:bg-white transition-colors">
                  <Play className="ml-1 h-6 w-6 text-gray-900" />
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Progress */}
        <div>
          <div className="mb-2 flex items-center justify-between text-sm">
            <span className="font-medium text-gray-900">Progress</span>
            <span className="text-gray-600">
              {currentTime.toFixed(1)}s / {totalDuration.toFixed(1)}s
            </span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        {/* Current Image Info */}
        <div className="rounded-lg border border-gray-200 bg-gray-50 p-3">
          <div className="text-center">
            <p className="truncate font-medium text-sm text-gray-900">
              {currentImage?.name}
            </p>
            <div className="mt-1 flex items-center justify-center space-x-2 text-xs text-gray-600">
              <span>Frame {currentImageIndex + 1}</span>
              <span>•</span>
              <span>{fps} FPS</span>
              <span>•</span>
              <span>Looping</span>
            </div>
          </div>
        </div>

        {/* Status */}
        <div className="text-center">
          <div className="inline-flex items-center space-x-2 text-sm text-gray-600">
            <div
              className={`h-2 w-2 rounded-full ${isPlaying ? "bg-green-500" : "bg-gray-400"}`}
            />
            <span>{isPlaying ? "Playing continuously" : "Paused"}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
