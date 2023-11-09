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
// import ElectronLogsDialog from "./components/electron/ElectronLogsDialog";
import PythonManagerTabView from "./routes/python_manager_panel/PythonManagerTabView";
import { Layout } from "./routes/common/Layout";
import LoadingPage from "./routes/loading/LoadingPage";
import { Index } from "./routes/index";

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
          <Route path="/loading" element={<LoadingPage />} />
        </Routes>
      </div>
    </ThemeProvider>
  );
};

export default App;
