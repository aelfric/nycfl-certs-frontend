import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig(() => {
  const backendUrl =
    process.env["BACKEND_URL"] || "https://forensics.frankriccobono.com";
  return {
    server: {
      port: 3000,
      proxy: {
        "/certs": {
          target: backendUrl,
          changeOrigin: true,
        },
        "/enums": {
          target: backendUrl,
          changeOrigin: true,
        },
        "/s3": {
          target: backendUrl,
          changeOrigin: true,
        },
      },
    },
    build: {
      outDir: "build",
    },
    plugins: [react()],
    test: {
      environment: "jsdom",
      setupFiles: "src/setupTests.js",
    },
  };
});
