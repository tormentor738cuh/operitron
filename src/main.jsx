import React from "react";
import { createRoot } from "react-dom/client";
import "./styles.css";
import CompFinderPro from "./CompFinderPro.jsx";

createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <CompFinderPro />
  </React.StrictMode>,
);
