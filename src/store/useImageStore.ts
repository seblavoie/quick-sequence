import { create } from "zustand";

export interface ImageItem {
  id: string;
  file: File;
  url: string;
  name: string;
}

interface ImageStore {
  images: ImageItem[];
  fps: number;
  isExporting: boolean;

  // Actions
  addImages: (files: File[]) => void;
  removeImage: (id: string) => void;
  reorderImages: (oldIndex: number, newIndex: number) => void;
  setFps: (fps: number) => void;
  setIsExporting: (isExporting: boolean) => void;
  clearImages: () => void;
}

// Deterministic ID generator using timestamp and counter
let idCounter = 0;
const generateId = () => {
  return `img_${Date.now()}_${++idCounter}`;
};

export const useImageStore = create<ImageStore>((set, get) => ({
  images: [],
  fps: 30,
  isExporting: false,

  addImages: (files: File[]) => {
    const newImages: ImageItem[] = files.map((file) => ({
      id: generateId(),
      file,
      url: URL.createObjectURL(file),
      name: file.name,
    }));

    set((state) => ({
      images: [...state.images, ...newImages],
    }));
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

  setFps: (fps: number) => {
    set({ fps });
  },

  setIsExporting: (isExporting: boolean) => {
    set({ isExporting });
  },

  clearImages: () => {
    const { images } = get();
    images.forEach((img) => URL.revokeObjectURL(img.url));
    set({ images: [] });
  },
}));
