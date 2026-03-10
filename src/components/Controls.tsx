import { Download, Loader2, Settings, X } from "lucide-react";
import React, { useEffect, useState } from "react";
import {
  exportMedia,
  getCodecInfo,
  isWebCodecsSupported,
} from "../lib/videoExport";
import { useImageStore } from "../store/useImageStore";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Progress } from "./ui/progress";
import { Slider } from "./ui/slider";

const MIN_DIMENSION = 2;
const MAX_DIMENSION = 7680;

const normalizeDimension = (value: number) => {
  if (!Number.isFinite(value)) return MIN_DIMENSION;
  return Math.min(MAX_DIMENSION, Math.max(MIN_DIMENSION, Math.round(value)));
};

const getAspectRatioLabel = (width: number, height: number) => {
  const gcd = (a: number, b: number): number => (b === 0 ? a : gcd(b, a % b));
  const divisor = gcd(width, height);
  return `${Math.round(width / divisor)}:${Math.round(height / divisor)}`;
};

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
  const [tempWidth, setTempWidth] = useState(exportSettings.width.toString());
  const [tempHeight, setTempHeight] = useState(exportSettings.height.toString());

  useEffect(() => {
    setTempWidth(exportSettings.width.toString());
    setTempHeight(exportSettings.height.toString());
  }, [exportSettings.width, exportSettings.height]);

  const fps = getFps();
  const codecInfo = getCodecInfo();
  const webCodecsSupported = isWebCodecsSupported();

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

  const handleWidthSave = () => {
    const value = parseInt(tempWidth, 10);
    if (Number.isNaN(value)) {
      setTempWidth(exportSettings.width.toString());
      return;
    }

    const width = normalizeDimension(value);
    setExportSettings({ width });
    setTempWidth(width.toString());
  };

  const handleHeightSave = () => {
    const value = parseInt(tempHeight, 10);
    if (Number.isNaN(value)) {
      setTempHeight(exportSettings.height.toString());
      return;
    }

    const height = normalizeDimension(value);
    setExportSettings({ height });
    setTempHeight(height.toString());
  };

  const applyAspectRatio = (ratioWidth: number, ratioHeight: number) => {
    const nextHeight = normalizeDimension(
      (exportSettings.width * ratioHeight) / ratioWidth,
    );
    setExportSettings({ height: nextHeight });
    setTempHeight(nextHeight.toString());
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

          {/* Quality Info */}
          <div>
            <div className="mb-2">
              <label className="text-sm font-medium text-gray-900">
                Export Quality
              </label>
            </div>
            <p className="text-xs text-blue-600">
              {exportSettings.quality === "full"
                ? "Ultra-high quality (100Mbps)"
                : exportSettings.quality === "medium"
                  ? "High quality (25Mbps)"
                  : "Good quality (8Mbps)"}
            </p>
            <p className="text-xs text-gray-500 mt-1">
              Codec: {codecInfo.encoding} {codecInfo.format}
              {webCodecsSupported && (
                <span className="ml-2 text-green-600">• WebCodecs ready</span>
              )}
            </p>
          </div>

          {/* Output Size */}
          <div>
            <div className="mb-2">
              <label className="text-sm font-medium text-gray-900">
                Output Size
              </label>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="mb-1 block text-xs text-gray-600">Width</label>
                <input
                  type="number"
                  min={MIN_DIMENSION}
                  max={MAX_DIMENSION}
                  step={1}
                  value={tempWidth}
                  onChange={(e) => setTempWidth(e.target.value)}
                  onBlur={handleWidthSave}
                  onKeyDown={(e) => e.key === "Enter" && handleWidthSave()}
                  className="w-full rounded-md border border-gray-300 px-2 py-1.5 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
              </div>
              <div>
                <label className="mb-1 block text-xs text-gray-600">
                  Height
                </label>
                <input
                  type="number"
                  min={MIN_DIMENSION}
                  max={MAX_DIMENSION}
                  step={1}
                  value={tempHeight}
                  onChange={(e) => setTempHeight(e.target.value)}
                  onBlur={handleHeightSave}
                  onKeyDown={(e) => e.key === "Enter" && handleHeightSave()}
                  className="w-full rounded-md border border-gray-300 px-2 py-1.5 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
              </div>
            </div>
            <div className="mt-3 grid grid-cols-4 gap-2">
              {[
                { label: "1:1", w: 1, h: 1 },
                { label: "4:3", w: 4, h: 3 },
                { label: "16:9", w: 16, h: 9 },
                { label: "9:16", w: 9, h: 16 },
              ].map((ratio) => (
                <Button
                  key={ratio.label}
                  variant="outline"
                  size="sm"
                  onClick={() => applyAspectRatio(ratio.w, ratio.h)}
                  className="border-gray-300 text-gray-700 hover:bg-gray-50"
                >
                  {ratio.label}
                </Button>
              ))}
            </div>
            <p className="mt-2 text-xs text-gray-500">
              Auto-set from your first uploaded image when possible.
            </p>
          </div>

          {/* Export Status and Button */}
          <div>
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
                {codecInfo.encoding}
              </Badge>
              <Badge
                variant="outline"
                className="border-orange-200 bg-orange-50 text-orange-700"
              >
                {getAspectRatioLabel(exportSettings.width, exportSettings.height)}
              </Badge>
              <Badge
                variant="outline"
                className="border-gray-200 bg-gray-50 text-gray-700"
              >
                {exportSettings.width}×{exportSettings.height}
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
                  Creating video...
                </>
              ) : (
                <>
                  <Download className="mr-2 h-4 w-4" />
                  Export Video
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
