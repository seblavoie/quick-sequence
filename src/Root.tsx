import { Composition } from "remotion";
import { Slideshow } from "./Composition";
import "./index.css";

// Sample data for the composition - in practice this would come from your store
const sampleImages = [
  {
    id: "1",
    url: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800",
    name: "Sample 1",
  },
  {
    id: "2",
    url: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800",
    name: "Sample 2",
  },
];

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="Slideshow"
        component={Slideshow}
        durationInFrames={300} // 10 seconds at 30 FPS
        fps={30}
        width={1920}
        height={1080}
        defaultProps={{
          images: sampleImages,
          framesPerImage: 30,
        }}
      />
    </>
  );
};
