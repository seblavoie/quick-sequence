import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

export default defineConfig(async () => {
  const { default: tailwindcss } = await import("@tailwindcss/vite");

  return {
    plugins: [react(), tailwindcss()],
    server: {
      port: 3001,
      open: true,
    },
    resolve: {
      alias: {
        "@": "/src",
      },
    },
  };
});
