import { createRoot } from "react-dom/client";
import "./index.css";
// Ensure Builder is initialized as early as possible so builder.* helpers are available
import "./lib/builder";
import App from "./App.tsx";

createRoot(document.getElementById("root")!).render(<App />);
