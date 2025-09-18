// Entry point: initialize React and attach to DOM #root
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

// Mount the root React tree
createRoot(document.getElementById("root")!).render(<App />);
