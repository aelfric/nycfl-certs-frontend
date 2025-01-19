import React from "react";
import { createRoot, Root } from "react-dom/client";
import "./index.css";
import App from "./App";
import { ErrorBoundary } from "./error-boundary";
import { AuthProvider } from "react-oidc-context";
import { WebStorageStateStore } from "oidc-client-ts";

const root: Root = createRoot(document.getElementById("root")!);

const oidcConfig = {
  authority: "https://keycloak.riccobono.dev/realms/Forensics",
  client_id: "nycfl-frontend",
  redirect_uri: "http://localhost:3000",
  response_mode: "fragment",
  userStore: new WebStorageStateStore({ store: window.localStorage }),
};

root.render(
  <AuthProvider {...oidcConfig}>
    <React.StrictMode>
      <ErrorBoundary>
        <App />
      </ErrorBoundary>
    </React.StrictMode>
  </AuthProvider>,
);
