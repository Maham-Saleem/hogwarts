import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { AudioProvider } from "@/context/AudioContext";
import { DiscoveryProvider } from "@/context/DiscoveryContext";
import App from "./App";
import "@/styles/index.css";
import "@fontsource/cinzel/400.css";
import "@fontsource/cinzel/700.css";
import "@fontsource/cinzel-decorative/400.css";
import "@fontsource/cinzel-decorative/700.css";
import "@fontsource/cormorant-garamond/400.css";
import "@fontsource/cormorant-garamond/600.css";
import "@fontsource/inter/400.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <AudioProvider>
        <DiscoveryProvider>
          <App />
        </DiscoveryProvider>
      </AudioProvider>
    </BrowserRouter>
  </StrictMode>
);
