import { useEffect, useRef, useState } from "react";

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
import { IS_CLOUD_DEMO, CLOUD_DEMO_TIMEOUT_REDIRECT_URL } from "./data/constants";

const minute = 60000; // 1 minute in milliseconds

const useDetectCloudDemoTimeout = () => {
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const resetTimeout = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    timeoutRef.current = setTimeout(() => {
      if (IS_CLOUD_DEMO) {
        fetch('/kill-demo', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ currentUrl: window.location.href }),
        })
        .then(response => response.json())
        .then(data => {
          console.log(data);
          // TODO flojoy ai examples list or something similar
          window.location.href = CLOUD_DEMO_TIMEOUT_REDIRECT_URL;
        })
        .catch((error) => {
          console.error('Error:', error);
        });
      }
    }, minute * 1);
  };
  useEffect(() => {
    if (IS_CLOUD_DEMO) {
      window.addEventListener("mousemove", resetTimeout);
      window.addEventListener("mousedown", resetTimeout);
      window.addEventListener("keypress", resetTimeout);
      window.addEventListener("touchmove", resetTimeout);
      window.addEventListener("scroll", resetTimeout);
      return () => {
        window.removeEventListener("mousemove", resetTimeout);
        window.removeEventListener("mousedown", resetTimeout);
        window.removeEventListener("keypress", resetTimeout);
        window.removeEventListener("touchmove", resetTimeout);
        window.removeEventListener("scroll", resetTimeout);
      };
    }
  }, []);
};

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
  useDetectCloudDemoTimeout();

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
