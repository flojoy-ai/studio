import React from "react";
import App from "./App";
import { SocketContextProvider } from "./context/socket.context";
import "./index.css";
// default styling
import { createRoot } from "react-dom/client";
import "reactflow/dist/style.css";

// or if you just want basic styles
import "reactflow/dist/base.css";

import { ErrorBoundary } from "react-error-boundary";
import { ErrorPage } from "@src/ErrorPage";

const root = createRoot(document.getElementById("root") as HTMLElement);

function fallbackRender({ error, resetErrorBoundary }) {
  return <ErrorPage error={error} resetErrorBoundary={resetErrorBoundary} />;
}

root.render(
  <React.StrictMode>
    <ErrorBoundary fallbackRender={fallbackRender}>
      <SocketContextProvider>
        <App />
      </SocketContextProvider>
    </ErrorBoundary>
  </React.StrictMode>
);
