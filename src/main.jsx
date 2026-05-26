import React from "react";
import { createRoot } from "react-dom/client";
import { Analytics } from "@vercel/analytics/react";
import "./styles.css";
import CompFinderPro from "./CompFinderPro.jsx";

function GoogleAnalyticsPlaceholder() {
  React.useEffect(() => {
    const measurementId = import.meta.env.VITE_GA_MEASUREMENT_ID;
    if (!measurementId || document.querySelector(`[data-ga-id="${measurementId}"]`)) return;
    const script = document.createElement("script");
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(measurementId)}`;
    script.dataset.gaId = measurementId;
    document.head.appendChild(script);
    window.dataLayer = window.dataLayer || [];
    function gtag() {
      window.dataLayer.push(arguments);
    }
    gtag("js", new Date());
    gtag("config", measurementId);
  }, []);
  return null;
}

createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <CompFinderPro />
    <Analytics />
    <GoogleAnalyticsPlaceholder />
  </React.StrictMode>,
);
