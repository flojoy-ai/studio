import { useEffect, useState } from "react";

import { useRouteError, Route, Routes } from "react-router-dom";
import "./App.css";
import PreJobOperationDialog from "./feature/common/PreJobOperationDialog";
import {
  // unsavedChangesAtom,
  useFlowChartState,
} from "./hooks/useFlowChartState";
import { useSocket } from "./hooks/useSocket";
// import useKeyboardShortcut from "./hooks/useKeyboardShortcut";
import { sendFrontEndLoadsToMix } from "@src/services/MixpanelServices";
import { ErrorPage } from "@src/ErrorPage";
import FlowChartTab from "./feature/flow_chart_panel/FlowChartTabView";
import { ThemeProvider } from "@src/providers/themeProvider";
// import { useAtom } from "jotai";
//

function ErrorBoundary() {
  const error: Error = useRouteError() as Error;
  return (
    <ErrorPage error={error} resetErrorBoundary={() => location.reload()} />
  );
}

const App = () => {
  const {
    states: { runningNode, failedNodes, preJobOperation },
  } = useSocket();
  const [isPrejobModalOpen, setIsPrejobModalOpen] = useState(false);
  const { setRunningNode, setFailedNodes } = useFlowChartState();
  // const [hasUnsavedChanges] = useAtom(unsavedChangesAtom);

  useEffect(() => {
    setRunningNode(runningNode);
    setFailedNodes(failedNodes);
  }, [runningNode, failedNodes, setRunningNode, setFailedNodes]);

  useEffect(() => {
    if (preJobOperation.isRunning) {
      setIsPrejobModalOpen(true);
    } else {
      setIsPrejobModalOpen(false);
    }
  }, [preJobOperation]);

  useEffect(() => {
    sendFrontEndLoadsToMix();
  }, []);

  // useKeyboardShortcut("ctrl", "b", () => setIsSidebarOpen((prev) => !prev));
  // useKeyboardShortcut("meta", "b", () => setIsSidebarOpen((prev) => !prev));

  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <div id="tw-theme-root">
        <PreJobOperationDialog
          open={isPrejobModalOpen}
          outputs={preJobOperation.output}
          setOpen={setIsPrejobModalOpen}
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
