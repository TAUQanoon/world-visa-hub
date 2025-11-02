import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import "./lib/builder";
import { registerCustomComponents } from "./components/builder/CustomComponents";
import "./components/builder/FormHandler";

// Register Builder.io custom components
registerCustomComponents();

createRoot(document.getElementById("root")!).render(<App />);
