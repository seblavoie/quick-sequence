import {
  ExportSettings,
  ImageItem,
  QualityPreset,
} from "../store/useImageStore";

export interface ExportOptions {
  images: ImageItem[];
  fps: number;
  imageDuration?: number; // Duration each image shows (in seconds)
  exportSettings?: ExportSettings;
  onProgress?: (progress: number) => void;
}

export interface ExportResult {
  filename: string;
  fileSize: string;
  duration: number;
  format: string;
}

// Helper function to load an image
const loadImage = (url: string): Promise<HTMLImageElement> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = url;
  });
};

// Helper function to draw image centered and scaled to fit canvas
const drawImageCentered = (
  ctx: CanvasRenderingContext2D,
  img: HTMLImageElement,
  canvasWidth: number,
  canvasHeight: number,
) => {
  // Clear canvas with black background
  ctx.fillStyle = "#000000";
  ctx.fillRect(0, 0, canvasWidth, canvasHeight);

  // Calculate scaling to fit image while maintaining aspect ratio
  const scale = Math.min(canvasWidth / img.width, canvasHeight / img.height);
  const scaledWidth = img.width * scale;
  const scaledHeight = img.height * scale;

  // Center the image
  const x = (canvasWidth - scaledWidth) / 2;
  const y = (canvasHeight - scaledHeight) / 2;

  // Draw the image
  ctx.drawImage(img, x, y, scaledWidth, scaledHeight);
};

// Quality preset configurations for H.264
const getH264QualityConfig = (quality: QualityPreset) => {
  const baseConfig = {
    low: { videoBitrate: 4000000, crf: 25 }, // 4 Mbps, decent quality
    medium: { videoBitrate: 15000000, crf: 18 }, // 15 Mbps, good quality
    full: { videoBitrate: 50000000, crf: 10 }, // 50 Mbps, near-lossless quality
  };

  return baseConfig[quality] || baseConfig.full;
};

// Check what codecs the browser supports
const getSupportedCodec = () => {
  const codecs = [
    // H.264 codecs (preferred)
    'video/mp4; codecs="avc1.42E01E"', // H.264 Baseline
    'video/mp4; codecs="avc1.4D401E"', // H.264 Main
    'video/mp4; codecs="avc1.64001E"', // H.264 High
    'video/mp4; codecs="avc1.42E01F"', // H.264 Baseline (high bitrate)
    'video/mp4; codecs="avc1.4D401F"', // H.264 Main (high bitrate)
    'video/mp4; codecs="avc1.64001F"', // H.264 High (high bitrate)
    // Fallback to generic MP4
    "video/mp4",
    // WebM VP9 (fallback)
    'video/webm; codecs="vp9"',
    "video/webm",
  ];

  for (const codec of codecs) {
    if (MediaRecorder.isTypeSupported(codec)) {
      return codec;
    }
  }

  // If nothing is supported, return the first one and let the browser handle it
  return "video/mp4";
};

// Get codec information for display
export const getCodecInfo = () => {
  const codec = getSupportedCodec();
  const isWebM = codec.includes("webm");
  const isH264 = codec.includes("avc1") || (codec === "video/mp4" && !isWebM);

  return {
    codec,
    format: isWebM ? "WebM" : "MP4",
    encoding: isH264 ? "H.264" : isWebM ? "VP9" : "Auto",
    extension: isWebM ? "webm" : "mp4",
  };
};

// Helper function to get codec and extension for format
const getFormatConfig = () => {
  const mimeType = getSupportedCodec();
  const isWebM = mimeType.includes("webm");

  return {
    mimeType,
    extension: isWebM ? "webm" : "mp4",
    formatName: isWebM ? "VP9 WebM" : "H.264 MP4",
  };
};

// Export using MediaRecorder (for H.264 MP4 or VP9 WebM)
const exportWithMediaRecorder = async ({
  images,
  fps,
  imageDuration,
  exportSettings,
  onProgress,
}: {
  images: ImageItem[];
  fps: number;
  imageDuration: number;
  exportSettings: ExportSettings;
  onProgress?: (progress: number) => void;
}): Promise<ExportResult> => {
  const baseWidth = 1920;
  const baseHeight = 1080;
  const width = Math.round(baseWidth * exportSettings.scale);
  const height = Math.round(baseHeight * exportSettings.scale);

  const qualityConfig = getH264QualityConfig(exportSettings.quality);
  const formatConfig = getFormatConfig();

  // Load all images first
  onProgress?.(10);
  const loadedImages = await Promise.all(
    images.map(async (img) => await loadImage(img.url)),
  );
  onProgress?.(20);

  // Create canvas
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");

  if (!ctx) {
    throw new Error("Could not get canvas context");
  }

  // Set up MediaRecorder with detected codec
  const stream = canvas.captureStream(fps);
  const mediaRecorder = new MediaRecorder(stream, {
    mimeType: formatConfig.mimeType,
    videoBitsPerSecond: qualityConfig.videoBitrate * exportSettings.scale,
  });

  const chunks: Blob[] = [];
  mediaRecorder.ondataavailable = (event) => {
    if (event.data.size > 0) {
      chunks.push(event.data);
    }
  };

  // Promise to handle recording completion
  const recordingComplete = new Promise<Blob>((resolve) => {
    mediaRecorder.onstop = () => {
      const blob = new Blob(chunks, { type: formatConfig.mimeType });
      resolve(blob);
    };
  });

  // Start recording
  mediaRecorder.start();
  onProgress?.(30);

  // Calculate timing based on image duration and fps
  const frameInterval = 1000 / fps; // milliseconds per frame
  const framesPerImage = Math.max(1, Math.round(imageDuration * fps)); // frames per image
  const totalFrames = images.length * framesPerImage;

  let currentFrame = 0;

  // Animation function
  const renderFrame = () => {
    return new Promise<void>((resolve) => {
      // Determine which image to show based on frames
      const imageIndex = Math.floor(currentFrame / framesPerImage);

      if (imageIndex < loadedImages.length) {
        const img = loadedImages[imageIndex];
        drawImageCentered(ctx, img, width, height);
      }

      currentFrame++;

      // Update progress
      const progress = 30 + (currentFrame / totalFrames) * 60; // 30% to 90%
      onProgress?.(progress);

      // Continue or finish
      if (currentFrame < totalFrames) {
        setTimeout(() => {
          renderFrame().then(resolve);
        }, frameInterval);
      } else {
        resolve();
      }
    });
  };

  // Start rendering frames
  await renderFrame();

  // Stop recording
  mediaRecorder.stop();
  onProgress?.(95);

  // Wait for recording to complete
  const videoBlob = await recordingComplete;

  // Create download link
  const url = URL.createObjectURL(videoBlob);
  const timestamp = new Date().toISOString().replace(/[:.]/g, "-").slice(0, 19);
  const filename = `slideshow-${timestamp}.${formatConfig.extension}`;

  // Trigger download
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);

  // Clean up
  URL.revokeObjectURL(url);

  onProgress?.(100);

  // Return success data
  const totalDuration = images.length * imageDuration;
  const fileSizeMB = (videoBlob.size / (1024 * 1024)).toFixed(1);

  return {
    filename,
    fileSize: `${fileSizeMB} MB`,
    duration: totalDuration,
    format: `${formatConfig.formatName} (${width}×${height}, ${exportSettings.quality.toUpperCase()})`,
  };
};

// Main export function
export const exportMedia = async ({
  images,
  fps,
  imageDuration = 1.0,
  exportSettings = { quality: "full", scale: 1.0, format: "h264" },
  onProgress,
}: ExportOptions): Promise<ExportResult> => {
  if (images.length === 0) {
    throw new Error("No images to export");
  }

  try {
    // Use MediaRecorder for H.264 MP4 export
    return await exportWithMediaRecorder({
      images,
      fps,
      imageDuration,
      exportSettings,
      onProgress,
    });
  } catch (error) {
    console.error("Export failed:", error);
    throw new Error(
      `Export failed: ${error instanceof Error ? error.message : "Unknown error"}`,
    );
  }
};

// Legacy function - now just calls the main export function
export const exportToH264 = async (
  options: ExportOptions,
): Promise<ExportResult> => {
  return exportMedia({
    ...options,
    exportSettings: {
      quality: options.exportSettings?.quality || "medium",
      scale: options.exportSettings?.scale || 1.0,
      format: "h264" as const,
    },
  });
};
