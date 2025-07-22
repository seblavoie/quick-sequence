import { Img, useCurrentFrame, useVideoConfig } from "remotion";

export interface SlideshowProps {
  images?: Array<{
    id: string;
    url: string;
    name: string;
  }>;
  framesPerImage?: number;
}

export const Slideshow: React.FC<SlideshowProps> = ({
  images = [],
  framesPerImage = 30,
}) => {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();

  if (images.length === 0) {
    return (
      <div
        style={{
          width,
          height,
          backgroundColor: "#1e293b",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 48,
          color: "white",
          fontFamily: "Arial, sans-serif",
        }}
      >
        Add images to create your slideshow
      </div>
    );
  }

  // Calculate which image should be shown based on current frame
  const currentImageIndex = Math.floor(frame / framesPerImage);
  const imageToShow = images[currentImageIndex] || images[images.length - 1];

  return (
    <div
      style={{
        width,
        height,
        backgroundColor: "#000",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        position: "relative",
      }}
    >
      {imageToShow && (
        <Img
          src={imageToShow.url}
          style={{
            maxWidth: "100%",
            maxHeight: "100%",
            objectFit: "contain",
          }}
        />
      )}

      {/* Optional: Add image counter overlay */}
      <div
        style={{
          position: "absolute",
          bottom: 20,
          right: 20,
          backgroundColor: "rgba(0, 0, 0, 0.7)",
          color: "white",
          padding: "8px 16px",
          borderRadius: 4,
          fontSize: 18,
          fontFamily: "Arial, sans-serif",
        }}
      >
        {currentImageIndex + 1} / {images.length}
      </div>
    </div>
  );
};

// Legacy export for backward compatibility
export const MyComposition = Slideshow;
