import { useEffect, useState } from "react";

import { useRouteError, Route, Routes } from "react-router-dom";
import "./App.css";
import PreJobOperationDialog from "./feature/common/PreJobOperationDialog";
import { useFlowChartState } from "./hooks/useFlowChartState";
import { useSocket } from "./hooks/useSocket";
import { sendFrontEndLoadsToMix } from "@src/services/MixpanelServices";
import { ErrorPage } from "@src/ErrorPage";
import FlowChartTab from "./feature/flow_chart_panel/FlowChartTabView";
import { ThemeProvider } from "@src/providers/themeProvider";
import ElectronLogsDialog from "./components/electron/ElectronLogsDialog";
import { useMCStatusCodes } from "./hooks/useMCStatusCodes";
import { API_URI } from "./data/constants";

function ErrorBoundary() {
  const error: Error = useRouteError() as Error;
  return (
    <ErrorPage error={error} resetErrorBoundary={() => location.reload()} />
  );
}

const App = () => {
  const {
    states: { runningNode, failedNodes, modalConfig },
  } = useSocket();
  const [isPrejobModalOpen, setIsPrejobModalOpen] = useState(false);
  const { setRunningNode, setFailedNodes } = useFlowChartState();
  const { setStatusCodes } = useMCStatusCodes();

  useEffect(() => {
    setRunningNode(runningNode);
    setFailedNodes(failedNodes);
  }, [runningNode, failedNodes, setRunningNode, setFailedNodes]);

  useEffect(() => {
    setIsPrejobModalOpen(modalConfig.showModal ?? false);
  }, [modalConfig]);

  useEffect(() => {
    sendFrontEndLoadsToMix();
  }, []);

  // fetch status codes for MC from the backend at startup
  useEffect(() => {
    console.log("Fetching MC Status codes");
    // fetch the status codes from the backend from /mc_status_codes
    async function fetchStatusCodes() {
      const response = await fetch(`${API_URI}/mc_status_codes`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      });
      const data = await response.json();
      console.log("STATUS CODES ARE: ");
      console.log(data);
      setStatusCodes(data);
    }
    fetchStatusCodes().then(() => console.log("MC Status codes fetched"));
  }, []);

  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <div id="tw-theme-root">
        <ElectronLogsDialog />
        <PreJobOperationDialog
          open={isPrejobModalOpen}
          outputs={modalConfig.messages ?? []}
          setOpen={setIsPrejobModalOpen}
          title={modalConfig.title}
          description={modalConfig.description}
        />
        <Routes>
          <Route
            path="/"
            element={<FlowChartTab />}
            errorElement={<ErrorBoundary />}
          />
        </Routes>
      </div>
    </ThemeProvider>
  );
};

export default App;
