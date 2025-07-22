import { CheckCircle2, Download, Loader2, Settings, X } from "lucide-react";
import React from "react";
import { exportToH264 } from "../lib/videoExport";
import { useImageStore } from "../store/useImageStore";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Progress } from "./ui/progress";
import { Slider } from "./ui/slider";

export const Controls: React.FC = () => {
  const {
    fps,
    images,
    isExporting,
    exportProgress,
    exportSuccess,
    setFps,
    setIsExporting,
    setExportProgress,
    setExportSuccess,
    clearExportSuccess,
  } = useImageStore();

  const handleExport = async () => {
    if (images.length === 0) {
      alert("Please add at least one image to export");
      return;
    }

    setIsExporting(true);
    setExportProgress(0);
    clearExportSuccess();

    try {
      const result = await exportToH264({
        images,
        fps,
        onProgress: (progress) => {
          setExportProgress(progress);
        },
      });

      setExportSuccess(result);
    } catch (error) {
      console.error("Export failed:", error);
      alert("Export failed. Please try again.");
    } finally {
      setIsExporting(false);
      setExportProgress(0);
    }
  };

  const durationInSeconds = images.length > 0 ? images.length / fps : 0;
  const totalFrames = Math.ceil(durationInSeconds * fps);

  return (
    <Card className="border-gray-200">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center text-lg font-semibold text-gray-900">
          <Settings className="mr-2 h-5 w-5 text-gray-600" />
          Settings
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Export Success Message */}
        {exportSuccess && (
          <div className="rounded-lg border border-green-200 bg-green-50 p-4">
            <div className="flex items-start justify-between">
              <div className="flex items-center">
                <CheckCircle2 className="mr-2 h-5 w-5 text-green-600" />
                <div>
                  <h4 className="text-sm font-medium text-green-800">
                    Video exported successfully!
                  </h4>
                  <div className="mt-2 text-sm text-green-700">
                    <p>
                      <strong>File:</strong> {exportSuccess.filename}
                    </p>
                    <p>
                      <strong>Size:</strong> {exportSuccess.fileSize}
                    </p>
                    <p>
                      <strong>Duration:</strong> {exportSuccess.duration}s
                    </p>
                    <p>
                      <strong>Format:</strong> {exportSuccess.format}
                    </p>
                    <p className="mt-1">
                      The video has been downloaded to your Downloads folder.
                    </p>
                  </div>
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={clearExportSuccess}
                className="text-green-600 hover:text-green-800"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}

        {/* FPS Control */}
        <div>
          <div className="mb-3 flex items-center justify-between">
            <label className="text-sm font-medium text-gray-900">
              Frame Rate
            </label>
            <Badge
              variant="outline"
              className="border-gray-200 bg-gray-50 text-gray-700"
            >
              {fps} FPS
            </Badge>
          </div>
          <Slider
            value={[fps]}
            onValueChange={([value]) => setFps(value)}
            min={1}
            max={120}
            step={1}
            className="w-full"
          />
          <div className="mt-2 flex justify-between text-xs text-gray-500">
            <span>1 FPS (slow)</span>
            <span>120 FPS (fast)</span>
          </div>
        </div>

        {/* Video Stats */}
        <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
          <h4 className="mb-3 text-sm font-medium text-gray-900">
            Video Information
          </h4>
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-xl font-bold text-gray-900">
                {images.length}
              </div>
              <div className="text-xs text-gray-600">Images</div>
            </div>
            <div>
              <div className="text-xl font-bold text-gray-900">
                {durationInSeconds.toFixed(1)}s
              </div>
              <div className="text-xs text-gray-600">Duration</div>
            </div>
            <div>
              <div className="text-xl font-bold text-gray-900">
                {totalFrames}
              </div>
              <div className="text-xs text-gray-600">Frames</div>
            </div>
          </div>
        </div>

        {/* Export Section */}
        <div>
          <h4 className="mb-3 text-sm font-medium text-gray-900">Export</h4>
          {images.length > 0 ? (
            <div className="mb-4 rounded-lg border border-green-200 bg-green-50 p-3">
              <p className="text-sm text-green-800">
                Ready to export {images.length} images as a{" "}
                {durationInSeconds.toFixed(1)}s video at {fps} FPS
              </p>
            </div>
          ) : (
            <div className="mb-4 rounded-lg border border-gray-200 bg-gray-50 p-3">
              <p className="text-sm text-gray-600">
                Add images to enable video export
              </p>
            </div>
          )}

          {/* Export Progress */}
          {isExporting && (
            <div className="mb-4">
              <div className="mb-2 flex justify-between text-sm">
                <span className="text-gray-600">Creating video...</span>
                <span className="text-gray-900">
                  {Math.round(exportProgress)}%
                </span>
              </div>
              <Progress value={exportProgress} className="w-full" />
            </div>
          )}

          <Button
            onClick={handleExport}
            disabled={images.length === 0 || isExporting}
            className="w-full bg-indigo-600 hover:bg-indigo-700 focus:ring-indigo-500"
            size="lg"
          >
            {isExporting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Creating video...
              </>
            ) : (
              <>
                <Download className="mr-2 h-4 w-4" />
                Export to H.264
              </>
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
