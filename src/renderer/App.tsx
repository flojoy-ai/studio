import { useEffect, useLayoutEffect } from "react";

import { useRouteError, Route, Routes } from "react-router-dom";
import "./App.css";
import { useFlowChartState } from "./hooks/useFlowChartState";
import { useSocket } from "./hooks/useSocket";
import { ErrorPage } from "@src/ErrorPage";
import FlowChartTab from "./routes/flow_chart/FlowChartTabView";
import DeviceTab from "./routes/device_panel/DeviceView";
import { ThemeProvider } from "@src/providers/themeProvider";
import PythonManagerTabView from "./routes/python_manager_panel/PythonManagerTabView";
import { Layout } from "./routes/common/Layout";
import { Index } from "./routes/index";
import packageJson from "../../package.json";
import EditorView from "./routes/editor/EditorView";
import { initMixPanel } from "./services/MixpanelServices";

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
  useLayoutEffect(() => {
    initMixPanel();
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
          <Route path="/editor/:id" element={<EditorView />} />
        </Routes>
      </div>
    </ThemeProvider>
  );
};

export default App;
