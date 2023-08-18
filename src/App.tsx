import { useEffect, useState } from "react";

import { useDisclosure } from "@mantine/hooks";
import { GlobalStyles } from "./feature/common/Global";

import {
  ColorScheme,
  ColorSchemeProvider,
  MantineProvider,
} from "@mantine/core";
import { useRouteError, Route, Routes } from "react-router-dom";
import "./App.css";
import PreJobOperationShow from "./feature/common/PreJobOperationShow";
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
    states: { runningNode, failedNodes, modalConfig },
  } = useSocket();
  const [theme, setTheme] = useState<ColorScheme>("dark");
  const { setRunningNode, setFailedNodes } = useFlowChartState();
  const [
    isPrejobModalOpen,
    { open: openPreJobModal, close: closePreJobModal },
  ] = useDisclosure(false);

  const toggleColorScheme = (color?: ColorScheme) => {
    setTheme(color || (theme === "dark" ? "light" : "dark"));
  };

  useEffect(() => {
    setRunningNode(runningNode);
    setFailedNodes(failedNodes);
  }, [runningNode, failedNodes, setRunningNode, setFailedNodes]);
console.log(" is modal open: ", isPrejobModalOpen, " modalConfig: ", modalConfig)
  useEffect(()=>{
    if (modalConfig.showModal){
      openPreJobModal()
    } else {
      closePreJobModal()
    }
  },[closePreJobModal, modalConfig, openPreJobModal])

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
            <PreJobOperationShow
              opened={isPrejobModalOpen}
              outputs={modalConfig.messages ?? []}
              close={closePreJobModal}
              title = {modalConfig.title}
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
