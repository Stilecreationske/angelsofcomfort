import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { initVapiWidgetBranding } from "./utils/initVapiWidgetBranding";

initVapiWidgetBranding();

createRoot(document.getElementById("root")!).render(<App />);
