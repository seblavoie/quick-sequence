import { ImageItem } from "../store/useImageStore";

export interface ExportOptions {
  images: ImageItem[];
  fps: number;
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
  currentImage: number,
  totalImages: number,
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

// Function to get the best supported video format
const getBestVideoFormat = (): {
  mimeType: string;
  extension: string;
  formatName: string;
} => {
  // H.264 options (preferred)
  const h264Options = [
    "video/mp4;codecs=avc1.42E01E", // H.264 Baseline
    "video/mp4;codecs=avc1.64001E", // H.264 High Profile
    "video/mp4;codecs=h264", // Generic H.264
    "video/mp4", // Generic MP4
  ];

  // Check for H.264 support
  for (const mimeType of h264Options) {
    if (MediaRecorder.isTypeSupported(mimeType)) {
      return {
        mimeType,
        extension: "mp4",
        formatName: "H.264 MP4",
      };
    }
  }

  // Fallback to WebM
  const webmOptions = [
    "video/webm;codecs=vp9",
    "video/webm;codecs=vp8",
    "video/webm",
  ];

  for (const mimeType of webmOptions) {
    if (MediaRecorder.isTypeSupported(mimeType)) {
      return {
        mimeType,
        extension: "webm",
        formatName: "WebM VP9",
      };
    }
  }

  throw new Error(
    "No supported video format found. Please use Chrome, Firefox, or Edge.",
  );
};

export const exportToH264 = async ({
  images,
  fps,
  onProgress,
}: ExportOptions): Promise<ExportResult> => {
  if (images.length === 0) {
    throw new Error("No images to export");
  }

  try {
    // Video configuration
    const width = 1920;
    const height = 1080;
    const videoBitrate = 8000000; // 8 Mbps for good quality

    // Create canvas
    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext("2d");

    if (!ctx) {
      throw new Error("Could not get canvas context");
    }

    // Load all images first
    onProgress?.(10);
    const loadedImages = await Promise.all(
      images.map(async (img) => await loadImage(img.url)),
    );
    onProgress?.(20);

    // Get the best supported video format
    const videoFormat = getBestVideoFormat();

    // Set up MediaRecorder
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
        const blob = new Blob(chunks, { type: videoFormat.mimeType });
        resolve(blob);
      };
    });

    // Start recording
    mediaRecorder.start();
    onProgress?.(30);

    // Calculate timing
    const frameInterval = 1000 / fps; // milliseconds per frame
    const framesPerImage = fps; // 1 second per image
    const totalFrames = images.length * framesPerImage;

    let currentFrame = 0;

    // Animation function
    const renderFrame = () => {
      return new Promise<void>((resolve) => {
        // Determine which image to show
        const imageIndex = Math.floor(currentFrame / framesPerImage);

        if (imageIndex < loadedImages.length) {
          const img = loadedImages[imageIndex];
          drawImageCentered(
            ctx,
            img,
            width,
            height,
            imageIndex + 1,
            images.length,
          );
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
    const timestamp = new Date()
      .toISOString()
      .replace(/[:.]/g, "-")
      .slice(0, 19);
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

    // Return success data instead of showing alert
    const durationInSeconds = images.length;
    const fileSizeMB = (videoBlob.size / (1024 * 1024)).toFixed(1);

    return {
      filename,
      fileSize: `${fileSizeMB} MB`,
      duration: durationInSeconds,
      format: videoFormat.formatName,
    };
  } catch (error) {
    console.error("Export failed:", error);

    // Provide helpful error messages
    if (error instanceof Error) {
      if (error.message.includes("MediaRecorder")) {
        throw new Error(
          "Your browser does not support video recording. Please use Chrome, Firefox, or Edge.",
        );
      }
      if (error.message.includes("canvas")) {
        throw new Error(
          "Unable to create video canvas. Please try refreshing the page.",
        );
      }
    }

    throw new Error(
      `Export failed: ${error instanceof Error ? error.message : "Unknown error"}`,
    );
  }
};
