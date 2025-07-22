import {
  closestCenter,
  DndContext,
  DragEndEvent,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Check, GripVertical, Image as ImageIcon, Trash2 } from "lucide-react";
import React from "react";
import { cn } from "../lib/utils";
import { ImageItem, useImageStore } from "../store/useImageStore";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";

interface SortableImageItemProps {
  image: ImageItem;
  index: number;
}

const SortableImageItem: React.FC<SortableImageItemProps> = ({
  image,
  index,
}) => {
  const removeImage = useImageStore((state) => state.removeImage);

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: image.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        "group relative rounded-lg border bg-white transition-shadow",
        isDragging
          ? "border-indigo-200 shadow-lg"
          : "border-gray-200 hover:shadow-md",
      )}
    >
      <div className="flex items-center p-4">
        {/* Drag Handle */}
        <div
          {...attributes}
          {...listeners}
          className="mr-3 cursor-grab rounded p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600 active:cursor-grabbing"
        >
          <GripVertical className="h-4 w-4" />
        </div>

        {/* Index */}
        <div className="mr-4 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-gray-100 text-sm font-semibold text-gray-700">
          {index + 1}
        </div>

        {/* Thumbnail */}
        <div className="mr-4 h-16 w-16 flex-shrink-0 overflow-hidden rounded-lg border border-gray-200">
          <img
            src={image.url}
            alt={image.name}
            className="h-full w-full object-cover"
          />
        </div>

        {/* Info */}
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-medium text-gray-900">
            {image.name}
          </p>
          <div className="mt-1 flex items-center space-x-2">
            <Badge
              variant="secondary"
              className="bg-gray-100 text-gray-700 text-xs"
            >
              {(image.file.size / 1024).toFixed(1)} KB
            </Badge>
            <Badge
              variant="secondary"
              className="bg-gray-100 text-gray-700 text-xs"
            >
              {image.file.type.split("/")[1].toUpperCase()}
            </Badge>
          </div>
        </div>

        {/* Delete Button */}
        <Button
          variant="outline"
          size="sm"
          onClick={() => removeImage(image.id)}
          className="ml-4 border-red-200 text-red-700 opacity-0 transition-opacity group-hover:opacity-100 hover:bg-red-50 hover:border-red-300"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export const ImageList: React.FC = () => {
  const { images, reorderImages } = useImageStore();

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (active.id !== over?.id) {
      const oldIndex = images.findIndex((img) => img.id === active.id);
      const newIndex = images.findIndex((img) => img.id === over?.id);
      reorderImages(oldIndex, newIndex);
    }
  };

  if (images.length === 0) {
    return (
      <div className="text-center py-12">
        <ImageIcon className="mx-auto h-12 w-12 text-gray-400" />
        <h3 className="mt-2 text-sm font-semibold text-gray-900">
          No images yet
        </h3>
        <p className="mt-1 text-sm text-gray-600">
          Get started by uploading your first image above.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={images.map((img) => img.id)}
          strategy={verticalListSortingStrategy}
        >
          {images.map((image, index) => (
            <SortableImageItem key={image.id} image={image} index={index} />
          ))}
        </SortableContext>
      </DndContext>

      {/* Summary */}
      {images.length > 0 && (
        <div className="rounded-lg border border-green-200 bg-green-50 p-4">
          <div className="flex items-center">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-green-100">
              <Check className="h-4 w-4 text-green-600" />
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-green-800">
                Sequence ready
              </p>
              <p className="text-sm text-green-700">
                {images.length} {images.length === 1 ? "image" : "images"}{" "}
                arranged in the correct order
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
