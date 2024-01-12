import App from "./App";
import { SocketContextProvider } from "./context/socket.context";
import "./global.css";
import "./index.css";
// default styling
import { createRoot } from "react-dom/client";
import "reactflow/dist/style.css";

// or if you just want basic styles
import "reactflow/dist/base.css";

import { ErrorBoundary } from "react-error-boundary";
import { ErrorPage } from "@src/ErrorPage";
import { HashRouter } from "react-router-dom";
import { AuthContextProvider } from "./context/auth.context";

const root = createRoot(document.getElementById("root") as HTMLElement);

function fallbackRender({ error, resetErrorBoundary }) {
  return <ErrorPage error={error} resetErrorBoundary={resetErrorBoundary} />;
}

root.render(
  /** Using HashRouter as BrowserRouter doesn't work after build */
  <HashRouter>
    <ErrorBoundary fallbackRender={fallbackRender}>
      <AuthContextProvider>
        <SocketContextProvider>
          <App />
        </SocketContextProvider>
      </AuthContextProvider>
    </ErrorBoundary>
  </HashRouter>,
);
