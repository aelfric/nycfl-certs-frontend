import React from "react";
import { createRoot, Root } from "react-dom/client";
import "./index.css";
import App from "./App";
import { ReactKeycloakProvider } from "@react-keycloak/web";

import keycloak from "./keycloak";
import { ErrorBoundary } from "./error-boundary";

const root: Root = createRoot(document.getElementById("root")!);

root.render(
  <ReactKeycloakProvider authClient={keycloak}>
    <React.StrictMode>
      <ErrorBoundary>
        <App />
      </ErrorBoundary>
    </React.StrictMode>
  </ReactKeycloakProvider>,
);
