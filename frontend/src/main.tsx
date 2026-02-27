import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

const themeStorageKey = "portfolio_theme";
const savedTheme = window.localStorage.getItem(themeStorageKey);
const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
const resolvedTheme = savedTheme === "light" || savedTheme === "dark" ? savedTheme : prefersDark ? "dark" : "light";

document.documentElement.classList.toggle("dark", resolvedTheme === "dark");
document.documentElement.lang = "en";

createRoot(document.getElementById("root")!).render(<App />);
