import React from "react";
import { createRoot } from "react-dom/client";
import { Analytics } from "@vercel/analytics/react";
import "./styles.css";
import CompFinderPro from "./CompFinderPro.jsx";

function GoogleTrackingPlaceholder() {
  React.useEffect(() => {
    const measurementIds = [import.meta.env.VITE_GA_MEASUREMENT_ID, import.meta.env.VITE_GOOGLE_ADS_ID].filter(Boolean);
    if (!measurementIds.length || document.querySelector(`[data-gtag-id="${measurementIds[0]}"]`)) return;
    const script = document.createElement("script");
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(measurementIds[0])}`;
    script.dataset.gtagId = measurementIds[0];
    document.head.appendChild(script);
    window.dataLayer = window.dataLayer || [];
    window.gtag = window.gtag || function gtag() {
      window.dataLayer.push(arguments);
    };
    window.gtag("js", new Date());
    measurementIds.forEach((id) => window.gtag("config", id));
  }, []);
  return null;
}

createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <CompFinderPro />
    <Analytics />
    <GoogleTrackingPlaceholder />
  </React.StrictMode>,
);
