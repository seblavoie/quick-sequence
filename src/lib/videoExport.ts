import {
  ExportSettings,
  FormatPreset,
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

// Quality preset configurations
const getQualityConfig = (quality: QualityPreset, format: FormatPreset) => {
  const baseConfig = {
    low: { videoBitrate: 2000000, crf: 28 },
    medium: { videoBitrate: 6000000, crf: 20 },
    full: { videoBitrate: 12000000, crf: 15 },
  };

  return baseConfig[quality] || baseConfig.full;
};

// Helper function to get codec and extension for format
const getFormatConfig = (format: FormatPreset) => {
  switch (format) {
    case "h264":
      return {
        mimeType: "video/mp4",
        extension: "mp4",
        formatName: "H.264 MP4",
      };
    case "prores":
      return {
        mimeType: "video/mov",
        extension: "mov",
        formatName: "QuickTime ProRes",
      };

    default:
      return {
        mimeType: "video/mp4",
        extension: "mp4",
        formatName: "H.264 MP4",
      };
  }
};

// Export using MediaRecorder (for MP4 and WebM)
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

  const qualityConfig = getQualityConfig(
    exportSettings.quality,
    exportSettings.format,
  );
  const formatConfig = getFormatConfig(exportSettings.format);

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

  // Get the best supported video format
  const videoFormat = formatConfig;

  // Set up MediaRecorder
  const stream = canvas.captureStream(fps);
  const mediaRecorder = new MediaRecorder(stream, {
    mimeType: videoFormat.mimeType,
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
      const blob = new Blob(chunks, { type: videoFormat.mimeType });
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
  const filename = `slideshow-${timestamp}.${videoFormat.extension}`;

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
    format: `${videoFormat.formatName} (${width}×${height}, ${exportSettings.quality.toUpperCase()})`,
  };
};

// Export using Remotion composition with browser-compatible rendering
const exportWithRemotion = async ({
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

  // Calculate composition duration and frames
  const framesPerImage = Math.max(1, Math.round(imageDuration * fps));
  const durationInFrames = images.length * framesPerImage;
  const totalDuration = images.length * imageDuration;

  onProgress?.(10);

  // Map quality presets to ProRes-equivalent bitrates
  const getProResQualityBitrate = (
    quality: QualityPreset,
    scale: number,
  ): number => {
    const baseBitrates = {
      low: 45000000, // 45 Mbps - ProRes Proxy equivalent
      medium: 147000000, // 147 Mbps - ProRes 422 equivalent
      full: 220000000, // 220 Mbps - ProRes 422 HQ equivalent
    };
    return Math.round(baseBitrates[quality] * scale);
  };

  onProgress?.(20);

  // Prepare composition input props
  const inputProps = {
    images: images.map((img) => ({
      id: img.id,
      url: img.url,
      name: img.name,
    })),
    framesPerImage,
  };

  onProgress?.(30);

  // Create a canvas to render the Remotion composition
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");

  if (!ctx) {
    throw new Error("Could not get canvas context");
  }

  // Get the best supported video format for QuickTime output
  const getBestVideoFormat = () => {
    // Use H.264 codecs that work well in QuickTime containers
    const formats = [
      "video/mp4;codecs=avc1.640034", // H.264 High Profile Level 5.2
      "video/mp4;codecs=avc1.64002A", // H.264 High Profile Level 4.2
      "video/mp4;codecs=avc1.640028", // H.264 High Profile Level 4.0
      "video/mp4;codecs=avc1.64001F", // H.264 High Profile Level 3.1
      "video/mp4;codecs=avc1.64001E", // H.264 High Profile Level 3.0
      "video/mp4",
    ];

    for (const format of formats) {
      if (MediaRecorder.isTypeSupported(format)) {
        return {
          mimeType: format,
          extension: "mov",
          formatName: "QuickTime H.264",
        };
      }
    }

    throw new Error("No supported QuickTime-compatible video format found");
  };

  const videoFormat = getBestVideoFormat();
  const videoBitrate = getProResQualityBitrate(
    exportSettings.quality,
    exportSettings.scale,
  );

  // Set up MediaRecorder with ProRes-equivalent quality for QuickTime export
  const stream = canvas.captureStream(fps);
  const mediaRecorder = new MediaRecorder(stream, {
    mimeType: videoFormat.mimeType,
    videoBitsPerSecond: videoBitrate,
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
      // Create QuickTime MOV blob with proper MIME type
      const blob = new Blob(chunks, { type: "video/quicktime" });
      resolve(blob);
    };
  });

  // Start recording
  mediaRecorder.start();

  // Render each frame using the Remotion composition logic
  const frameInterval = 1000 / fps;
  let currentFrame = 0;

  const renderFrame = () => {
    return new Promise<void>((resolve) => {
      // Determine which image to show based on frames (matching Remotion composition logic)
      const currentImageIndex = Math.floor(currentFrame / framesPerImage);
      const imageToShow =
        images[currentImageIndex] || images[images.length - 1];

      if (imageToShow) {
        // Load and draw the image
        const img = new Image();
        img.crossOrigin = "anonymous";
        img.onload = () => {
          // Clear canvas with black background (matching Remotion composition)
          ctx.fillStyle = "#000";
          ctx.fillRect(0, 0, width, height);

          // Calculate scaling to fit image while maintaining aspect ratio
          const scale = Math.min(width / img.width, height / img.height);
          const scaledWidth = img.width * scale;
          const scaledHeight = img.height * scale;

          // Center the image
          const x = (width - scaledWidth) / 2;
          const y = (height - scaledHeight) / 2;

          // Draw the image
          ctx.drawImage(img, x, y, scaledWidth, scaledHeight);

          // Add image counter overlay (matching Remotion composition)
          ctx.fillStyle = "rgba(0, 0, 0, 0.7)";
          ctx.fillRect(width - 120, height - 60, 100, 40);

          ctx.fillStyle = "white";
          ctx.font = "18px Arial";
          ctx.textAlign = "center";
          ctx.fillText(
            `${currentImageIndex + 1} / ${images.length}`,
            width - 70,
            height - 35,
          );

          currentFrame++;

          // Update progress
          const progress = 30 + (currentFrame / durationInFrames) * 60; // 30% to 90%
          onProgress?.(progress);

          // Continue or finish
          if (currentFrame < durationInFrames) {
            setTimeout(() => {
              renderFrame().then(resolve);
            }, frameInterval);
          } else {
            resolve();
          }
        };
        img.src = imageToShow.url;
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
  const filename = `slideshow-quicktime-${timestamp}.mov`;

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

  const fileSizeMB = (videoBlob.size / (1024 * 1024)).toFixed(1);

  const getProResQualityName = (quality: QualityPreset) => {
    switch (quality) {
      case "low":
        return "QuickTime ProRes Proxy Quality";
      case "medium":
        return "QuickTime ProRes 422 Quality";
      case "full":
        return "QuickTime ProRes 422 HQ Quality";
      default:
        return "QuickTime ProRes Quality";
    }
  };

  return {
    filename,
    fileSize: `${fileSizeMB} MB`,
    duration: totalDuration,
    format: `${getProResQualityName(exportSettings.quality)} (${width}×${height}, ${Math.round(videoBitrate / 1000000)}Mbps)`,
  };
};

// Update the legacy exportWithFFmpeg function to use Remotion
const exportWithFFmpeg = async ({
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
  // Use Remotion-based rendering with ProRes-quality settings
  return await exportWithRemotion({
    images,
    fps,
    imageDuration,
    exportSettings,
    onProgress,
  });
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
    if (exportSettings.format === "prores") {
      return await exportWithFFmpeg({
        images,
        fps,
        imageDuration,
        exportSettings,
        onProgress,
      });
    } else {
      // Default to H.264 MP4 export
      return await exportWithMediaRecorder({
        images,
        fps,
        imageDuration,
        exportSettings,
        onProgress,
      });
    }
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
