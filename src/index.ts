import { registerRoot } from "remotion";
import { App } from "./App";
import { RemotionRoot } from "./Root";

// Register the Remotion Root for the studio
registerRoot(RemotionRoot);

// Export the web app for standalone use
export { App };
