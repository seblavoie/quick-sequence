import { Download, Loader2, Settings, X } from "lucide-react";
import React, { useState } from "react";
import { exportMedia } from "../lib/videoExport";
import { useImageStore } from "../store/useImageStore";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Progress } from "./ui/progress";
import { Slider } from "./ui/slider";

export const Controls: React.FC = () => {
  const {
    imageDuration,
    images,
    exportSettings,
    isExporting,
    exportProgress,
    exportSuccess,
    setImageDuration,
    setExportSettings,
    setIsExporting,
    setExportProgress,
    setExportSuccess,
    clearExportSuccess,
    getFps,
  } = useImageStore();

  const [isEditingDuration, setIsEditingDuration] = useState(false);
  const [tempDuration, setTempDuration] = useState(imageDuration.toString());

  const fps = getFps();

  const handleDurationEdit = () => {
    setTempDuration(imageDuration.toString());
    setIsEditingDuration(true);
  };

  const handleDurationSave = () => {
    const value = parseFloat(tempDuration);
    if (!isNaN(value) && value >= 1 / 60 && value <= 5.0) {
      setImageDuration(value);
    } else {
      setTempDuration(imageDuration.toString());
    }
    setIsEditingDuration(false);
  };

  const handleDurationKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleDurationSave();
    } else if (e.key === "Escape") {
      setTempDuration(imageDuration.toString());
      setIsEditingDuration(false);
    }
  };

  const handleExport = async () => {
    if (images.length === 0) {
      alert("Please add at least one image to export");
      return;
    }

    setIsExporting(true);
    setExportProgress(0);
    clearExportSuccess();

    try {
      const result = await exportMedia({
        images,
        fps,
        imageDuration,
        exportSettings,
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

  const totalDuration = images.length > 0 ? images.length * imageDuration : 0;
  const totalFrames = Math.ceil(totalDuration * fps);

  return (
    <div className="space-y-6">
      {/* Settings Card */}
      <Card className="border-gray-200">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center text-lg font-semibold text-gray-900">
            <Settings className="mr-2 h-5 w-5 text-gray-600" />
            Settings
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Image Duration Control */}
          <div>
            <div className="mb-3 flex items-center justify-between">
              <label className="text-sm font-medium text-gray-900">
                Image Duration
              </label>
              <div className="flex items-center space-x-2">
                {isEditingDuration ? (
                  <input
                    type="number"
                    value={tempDuration}
                    onChange={(e) => setTempDuration(e.target.value)}
                    onBlur={handleDurationSave}
                    onKeyDown={handleDurationKeyPress}
                    min={1 / 60}
                    max={5.0}
                    step={0.01}
                    autoFocus
                    className="w-16 rounded-md border border-indigo-500 px-2 py-1 text-xs text-center focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  />
                ) : (
                  <Badge
                    variant="outline"
                    className="border-gray-200 bg-gray-50 text-gray-700 cursor-pointer hover:bg-gray-100 transition-colors"
                    onClick={handleDurationEdit}
                  >
                    {imageDuration < 0.1
                      ? imageDuration.toFixed(3)
                      : imageDuration.toFixed(1)}
                    s
                  </Badge>
                )}
                <Badge
                  variant="outline"
                  className="border-blue-200 bg-blue-50 text-blue-700"
                >
                  {fps} FPS
                </Badge>
              </div>
            </div>
            <Slider
              value={[imageDuration]}
              onValueChange={([value]) => setImageDuration(value)}
              min={1 / 60}
              max={5.0}
              step={0.01}
              className="w-full"
            />
            <div className="mt-2 flex justify-between text-xs text-gray-500">
              <span>1/60s (ultra-fast)</span>
              <span>5.0s (slow)</span>
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
                  {totalDuration.toFixed(1)}s
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
        </CardContent>
      </Card>

      {/* Export Settings Card */}
      <Card className="border-gray-200">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center text-lg font-semibold text-gray-900">
            <Download className="mr-2 h-5 w-5 text-gray-600" />
            Export Settings
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Quality Control */}
          <div>
            <div className="mb-2">
              <label className="text-sm font-medium text-gray-900">
                Quality
              </label>
            </div>
            <div className="grid grid-cols-3 gap-2">
              {(["low", "medium", "full"] as const).map((quality) => (
                <Button
                  key={quality}
                  variant={
                    exportSettings.quality === quality ? "default" : "outline"
                  }
                  size="sm"
                  onClick={() => setExportSettings({ quality })}
                  className={
                    exportSettings.quality === quality
                      ? "bg-blue-600 hover:bg-blue-700"
                      : "border-gray-300 text-gray-700 hover:bg-gray-50"
                  }
                >
                  {quality.charAt(0).toUpperCase() + quality.slice(1)}
                </Button>
              ))}
            </div>
          </div>

          {/* Format Control */}
          <div>
            <div className="mb-2">
              <label className="text-sm font-medium text-gray-900">
                Format
              </label>
            </div>
            <div className="grid grid-cols-2 gap-2">
              {(["h264", "prores"] as const).map((format) => (
                <Button
                  key={format}
                  variant={
                    exportSettings.format === format ? "default" : "outline"
                  }
                  size="sm"
                  onClick={() => setExportSettings({ format })}
                  className={
                    exportSettings.format === format
                      ? "bg-blue-600 hover:bg-blue-700"
                      : "border-gray-300 text-gray-700 hover:bg-gray-50"
                  }
                >
                  {format === "h264" ? "MP4" : "QuickTime"}
                </Button>
              ))}
            </div>
            {exportSettings.format === "h264" && (
              <p className="mt-2 text-xs text-blue-600">
                H.264: Smaller files, good quality
              </p>
            )}
            {exportSettings.format === "prores" && (
              <p className="mt-2 text-xs text-blue-600">
                QuickTime ProRes 422 HQ: Larger files, better quality
              </p>
            )}
          </div>

          {/* Scale Control */}
          <div>
            <div className="mb-2">
              <label className="text-sm font-medium text-gray-900">Scale</label>
            </div>
            <div className="grid grid-cols-4 gap-2">
              {[0.25, 0.5, 0.75, 1.0].map((scale) => (
                <Button
                  key={scale}
                  variant={
                    exportSettings.scale === scale ? "default" : "outline"
                  }
                  size="sm"
                  onClick={() => setExportSettings({ scale })}
                  className={
                    exportSettings.scale === scale
                      ? "bg-blue-600 hover:bg-blue-700"
                      : "border-gray-300 text-gray-700 hover:bg-gray-50"
                  }
                >
                  {Math.round(scale * 100)}%
                </Button>
              ))}
            </div>
          </div>

          {/* Export Status and Button */}
          <div>
            {/* Export Progress */}
            {isExporting && (
              <div className="mb-4">
                <div className="mb-2 flex justify-between text-sm">
                  <span className="text-gray-600">
                    Creating{" "}
                    {exportSettings.format === "h264"
                      ? "video"
                      : "QuickTime video"}
                    ...
                  </span>
                  <span className="text-gray-900">
                    {Math.round(exportProgress)}%
                  </span>
                </div>
                <Progress value={exportProgress} className="w-full" />
              </div>
            )}

            {/* Current Selection Pills */}
            <div className="mb-4 flex flex-wrap gap-2 justify-center">
              <Badge
                variant="outline"
                className="border-blue-200 bg-blue-50 text-blue-700"
              >
                {exportSettings.quality.toUpperCase()}
              </Badge>
              <Badge
                variant="outline"
                className="border-blue-200 bg-blue-50 text-blue-700"
              >
                {exportSettings.format === "h264" ? "MP4" : "QuickTime"}
              </Badge>
              <Badge
                variant="outline"
                className="border-orange-200 bg-orange-50 text-orange-700"
              >
                {Math.round(exportSettings.scale * 100)}%
              </Badge>
              <Badge
                variant="outline"
                className="border-gray-200 bg-gray-50 text-gray-700"
              >
                {Math.round(1920 * exportSettings.scale)}×
                {Math.round(1080 * exportSettings.scale)}
              </Badge>
            </div>

            <Button
              onClick={handleExport}
              disabled={images.length === 0 || isExporting}
              className="w-full bg-indigo-600 hover:bg-indigo-700 focus:ring-indigo-500"
              size="lg"
            >
              {isExporting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating{" "}
                  {exportSettings.format === "h264"
                    ? "video"
                    : "QuickTime video"}
                  ...
                </>
              ) : (
                <>
                  <Download className="mr-2 h-4 w-4" />
                  Export to{" "}
                  {exportSettings.format === "h264" ? "MP4" : "QuickTime"}
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Export Success Message */}
      {exportSuccess && (
        <div className="rounded-lg border border-green-200 bg-green-50 p-4">
          <div className="flex items-start justify-between">
            <div>
              <h4 className="text-sm font-medium text-green-800">
                {exportSettings.format === "h264" ? "Video" : "QuickTime Video"}{" "}
                exported successfully!
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
                  The{" "}
                  {exportSettings.format === "h264"
                    ? "video"
                    : "QuickTime video"}{" "}
                  has been downloaded to your Downloads folder.
                </p>
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
    </div>
  );
};
