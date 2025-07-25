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
    build: {
      outDir: "dist",
      sourcemap: false,
      rollupOptions: {
        output: {
          manualChunks: {
            vendor: ["react", "react-dom"],
            ui: ["@radix-ui/react-progress", "@radix-ui/react-slider"],
            dnd: ["@dnd-kit/core", "@dnd-kit/sortable"],
          },
        },
      },
    },
    resolve: {
      alias: {
        "@": "/src",
      },
    },
  };
});
