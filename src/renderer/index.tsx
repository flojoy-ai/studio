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
import { ErrorPage } from "@/renderer/ErrorPage";
import { HashRouter } from "react-router-dom";
import { AuthContextProvider } from "./context/auth.context";
import { ThemeProvider } from "./providers/themeProvider";

const root = createRoot(document.getElementById("root") as HTMLElement);

function fallbackRender({ error, resetErrorBoundary }) {
  return <ErrorPage error={error} resetErrorBoundary={resetErrorBoundary} />;
}

root.render(
  /** Using HashRouter as BrowserRouter doesn't work after build */
  <HashRouter>
    <ErrorBoundary fallbackRender={fallbackRender}>
      <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
        <AuthContextProvider>
          <SocketContextProvider>
            <App />
          </SocketContextProvider>
        </AuthContextProvider>
      </ThemeProvider>
    </ErrorBoundary>
  </HashRouter>,
);
