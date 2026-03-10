import { create } from "zustand";

export interface ImageItem {
  id: string;
  file: File;
  url: string;
  name: string;
}

export type QualityPreset = "low" | "medium" | "full";
export type FormatPreset = "h264";

export interface ExportSettings {
  quality: QualityPreset;
  width: number;
  height: number;
  format: FormatPreset;
}

interface ImageStore {
  images: ImageItem[];
  imageDuration: number; // Duration in seconds each image shows
  exportSettings: ExportSettings;
  isExporting: boolean;
  exportProgress: number;
  exportSuccess: {
    filename: string;
    fileSize: string;
    duration: number;
    format: string;
  } | null;

  // Actions
  addImages: (files: File[]) => void;
  removeImage: (id: string) => void;
  reorderImages: (oldIndex: number, newIndex: number) => void;
  setImageDuration: (duration: number) => void;
  setExportSettings: (settings: Partial<ExportSettings>) => void;
  setIsExporting: (isExporting: boolean) => void;
  setExportProgress: (progress: number) => void;
  setExportSuccess: (
    success: {
      filename: string;
      fileSize: string;
      duration: number;
      format: string;
    } | null,
  ) => void;
  clearExportSuccess: () => void;
  clearImages: () => void;

  // Computed
  getFps: () => number;
}

// Deterministic ID generator using timestamp and counter
let idCounter = 0;
const generateId = () => {
  return `img_${Date.now()}_${++idCounter}`;
};

const DEFAULT_EXPORT_WIDTH = 1920;
const DEFAULT_EXPORT_HEIGHT = 1080;

const getImageDimensions = async (
  file: File,
): Promise<{ width: number; height: number } | null> => {
  const url = URL.createObjectURL(file);

  try {
    const dimensions = await new Promise<{ width: number; height: number }>(
      (resolve, reject) => {
        const img = new Image();
        img.onload = () => resolve({ width: img.width, height: img.height });
        img.onerror = reject;
        img.src = url;
      },
    );
    return dimensions;
  } catch (error) {
    console.warn("Could not infer image dimensions from first upload", error);
    return null;
  } finally {
    URL.revokeObjectURL(url);
  }
};

export const useImageStore = create<ImageStore>((set, get) => ({
  images: [],
  imageDuration: 1.0, // Default: 1 second per image
  exportSettings: {
    quality: "full",
    width: DEFAULT_EXPORT_WIDTH,
    height: DEFAULT_EXPORT_HEIGHT,
    format: "h264",
  },
  isExporting: false,
  exportProgress: 0,
  exportSuccess: null,

  addImages: (files: File[]) => {
    const shouldInferDimensions = get().images.length === 0 && files.length > 0;
    const newImages: ImageItem[] = files.map((file) => ({
      id: generateId(),
      file,
      url: URL.createObjectURL(file),
      name: file.name,
    }));

    set((state) => ({
      images: [...state.images, ...newImages],
    }));

    if (shouldInferDimensions) {
      const firstFile = files[0];
      void getImageDimensions(firstFile).then((dimensions) => {
        if (!dimensions) return;

        set((state) => ({
          exportSettings: {
            ...state.exportSettings,
            width: dimensions.width,
            height: dimensions.height,
          },
        }));
      });
    }
  },

  removeImage: (id: string) => {
    const { images } = get();
    const imageToRemove = images.find((img) => img.id === id);
    if (imageToRemove) {
      URL.revokeObjectURL(imageToRemove.url);
    }

    set((state) => ({
      images: state.images.filter((img) => img.id !== id),
    }));
  },

  reorderImages: (oldIndex: number, newIndex: number) => {
    set((state) => {
      const newImages = [...state.images];
      const [removed] = newImages.splice(oldIndex, 1);
      newImages.splice(newIndex, 0, removed);
      return { images: newImages };
    });
  },

  setImageDuration: (duration: number) => {
    set({ imageDuration: duration });
  },

  setExportSettings: (settings: Partial<ExportSettings>) => {
    set((state) => ({
      exportSettings: { ...state.exportSettings, ...settings },
    }));
  },

  setIsExporting: (isExporting: boolean) => {
    set({ isExporting, exportProgress: isExporting ? 0 : 0 });
  },

  setExportProgress: (progress: number) => {
    set({ exportProgress: progress });
  },

  setExportSuccess: (
    success: {
      filename: string;
      fileSize: string;
      duration: number;
      format: string;
    } | null,
  ) => {
    set({ exportSuccess: success });
  },

  clearExportSuccess: () => {
    set({ exportSuccess: null });
  },

  clearImages: () => {
    const { images } = get();
    images.forEach((img) => URL.revokeObjectURL(img.url));
    set({ images: [] });
  },

  // Calculate FPS based on image duration
  getFps: () => {
    const { imageDuration } = get();
    // FPS = 1 / duration, with minimum of 1 FPS for very long durations
    return Math.max(1, Math.round(1 / imageDuration));
  },
}));
