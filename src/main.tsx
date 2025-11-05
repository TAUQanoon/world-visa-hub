import { createRoot } from "react-dom/client";
import "./index.css";
<<<<<<< HEAD
// Ensure Builder is initialized as early as possible so builder.* helpers are available
import "./lib/builder";
import App from "./App.tsx";
=======
import "./lib/builder";
>>>>>>> 39269faf625baee062631ef980df2e912ca0bfaf

createRoot(document.getElementById("root")!).render(<App />);
