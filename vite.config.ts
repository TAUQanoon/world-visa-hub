import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

// Safe import for lovable-tagger - optional for build
let componentTagger: any = null;
try {
  const tagger = await import("lovable-tagger");
  componentTagger = tagger.componentTagger;
} catch (e) {
  console.warn("lovable-tagger not available - continuing without it");
}

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [
    react(),
    mode === 'development' && componentTagger ? componentTagger() : null,
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));
