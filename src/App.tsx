import { useEffect, useState } from "react";

import { GlobalStyles } from "./feature/common/Global";

import {
  ColorScheme,
  ColorSchemeProvider,
  MantineProvider,
} from "@mantine/core";
import { useRouteError, Route, Routes } from "react-router-dom";
import "./App.css";
import PreJobOperationDialog from "./feature/common/PreJobOperationDialog";
import { darkTheme, lightTheme } from "./feature/common/theme";
import { useFlowChartState } from "./hooks/useFlowChartState";
import { useSocket } from "./hooks/useSocket";
// import useKeyboardShortcut from "./hooks/useKeyboardShortcut";
import { sendFrontEndLoadsToMix } from "@src/services/MixpanelServices";
import { ErrorPage } from "@src/ErrorPage";
import FlowChartTab from "./feature/flow_chart_panel/FlowChartTabView";
import { ThemeProvider } from "@src/providers/theme-provider";

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
  const [theme, setTheme] = useState<ColorScheme>("dark");
  const [isPrejobModalOpen, setIsPrejobModalOpen] = useState(false);
  const { setRunningNode, setFailedNodes } = useFlowChartState();

  const toggleColorScheme = (color?: ColorScheme) => {
    setTheme(color || (theme === "dark" ? "light" : "dark"));
  };

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
  useEffect(() => {
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [theme]);

  // useKeyboardShortcut("ctrl", "b", () => setIsSidebarOpen((prev) => !prev));
  // useKeyboardShortcut("meta", "b", () => setIsSidebarOpen((prev) => !prev));

  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <ColorSchemeProvider
        colorScheme={theme}
        toggleColorScheme={toggleColorScheme}
      >
        <MantineProvider
          withGlobalStyles
          withNormalizeCSS
          theme={theme === "dark" ? darkTheme : lightTheme}
        >
          <div
            className={theme === "dark" ? "dark" : "light"}
            id="tw-theme-root"
          >
            <GlobalStyles />
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
        </MantineProvider>
      </ColorSchemeProvider>
    </ThemeProvider>
  );
};

export default App;
