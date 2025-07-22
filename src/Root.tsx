import { Composition } from "remotion";
import { Slideshow } from "./Composition";
import "./index.css";

// This will be populated by the actual app state when rendering
const getImagesFromStore = () => {
  // In browser environment, this will return empty array
  // In server environment during render, this should be populated via inputProps
  if (typeof window !== "undefined") {
    // Browser environment - return empty array as fallback
    return [];
  }
  // Server environment - this will be overridden by inputProps during render
  return [];
};

export const RemotionRoot: React.FC = () => {
  const defaultImages = getImagesFromStore();

  return (
    <>
      <Composition
        id="Slideshow"
        component={Slideshow}
        durationInFrames={300} // Will be overridden by render parameters
        fps={30} // Will be overridden by render parameters
        width={1920}
        height={1080}
        defaultProps={{
          images: defaultImages,
          framesPerImage: 30, // Will be overridden by render parameters
        }}
        calculateMetadata={({ props }) => {
          // Calculate duration based on actual images and fps
          const images =
            (props.images as Array<{
              id: string;
              url: string;
              name: string;
            }>) || [];
          const framesPerImage = (props.framesPerImage as number) || 30;
          const durationInFrames = images.length * framesPerImage;

          return {
            durationInFrames,
            fps: framesPerImage,
          };
        }}
      />
    </>
  );
};
