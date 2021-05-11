import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import * as serviceWorker from "./serviceWorker";
import { ReactKeycloakProvider } from '@react-keycloak/web';
 
import keycloak from './keycloak';
import {ErrorBoundary} from "./error-boundary";

ReactDOM.render(
  <React.StrictMode>
    <ReactKeycloakProvider authClient={keycloak}>
        <ErrorBoundary>
            <App />
        </ErrorBoundary>
    </ReactKeycloakProvider>
  </React.StrictMode>,
  document.getElementById("root")
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
