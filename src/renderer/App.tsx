import { useEffect } from "react";

import { useRouteError, Route, Routes } from "react-router-dom";
import "./App.css";
import { useFlowChartState } from "./hooks/useFlowChartState";
import { useSocket } from "./hooks/useSocket";
import { sendFrontEndLoadsToMix } from "@src/services/MixpanelServices";
import { ErrorPage } from "@src/ErrorPage";
import FlowChartTab from "./routes/flow_chart/FlowChartTabView";
import DeviceTab from "./routes/device_panel/DeviceView";
import { ThemeProvider } from "@src/providers/themeProvider";
import PythonManagerTabView from "./routes/python_manager_panel/PythonManagerTabView";
import { Layout } from "./routes/common/Layout";
import { Index } from "./routes/index";
import packageJson from "../../package.json";
import * as Sentry from "@sentry/react";

Sentry.init({
  dsn: "https://19498e4d4f62d838433d8321a81cceab@o4504914175131648.ingest.sentry.io/4506397011410944",
  integrations: [
    new Sentry.BrowserTracing({
      // Set 'tracePropagationTargets' to control for which URLs distributed tracing should be enabled
      tracePropagationTargets: ["localhost", /^https:\/\/yourserver\.io\/api/],
    }),
    new Sentry.Replay(),
  ],
  // Performance Monitoring
  tracesSampleRate: 1.0, //  Capture 100% of the transactions
  // Session Replay
  replaysSessionSampleRate: 0.1, // This sets the sample rate at 10%. You may want to change it to 100% while in development and then sample at a lower rate in production.
  replaysOnErrorSampleRate: 1.0, // If you're not already sampling the entire session, change the sample rate to 100% when sampling sessions where errors occur.
});

function ErrorBoundary() {
  const error: Error = useRouteError() as Error;
  return (
    <ErrorPage error={error} resetErrorBoundary={() => location.reload()} />
  );
}

const App = () => {
  const {
    states: { runningNode, failedNodes },
  } = useSocket();
  const { setRunningNode, setFailedNodes } = useFlowChartState();

  useEffect(() => {
    setRunningNode(runningNode);
    setFailedNodes(failedNodes);
  }, [runningNode, failedNodes, setRunningNode, setFailedNodes]);

  useEffect(() => {
    sendFrontEndLoadsToMix();
  }, []);

  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <div id="tw-theme-root">
        <div className="titlebar flex h-12 items-center justify-center bg-background font-bold">
          Flojoy Studio ({packageJson.version})
        </div>
        {/* <ElectronLogsDialog /> */}
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/" element={<Layout />}>
            <Route
              path="/flowchart"
              element={<FlowChartTab />}
              errorElement={<ErrorBoundary />}
            />
            <Route
              path="/devices"
              element={<DeviceTab />}
              errorElement={<ErrorBoundary />}
            />
            <Route
              path="/pymgr"
              element={<PythonManagerTabView />}
              errorElement={<ErrorBoundary />}
            />
          </Route>
        </Routes>
      </div>
    </ThemeProvider>
  );
};

export default App;
