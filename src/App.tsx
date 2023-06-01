import { useEffect, useState } from "react";

import ControlsTab, {
  ControlsTabLoader,
} from "./feature/controls_panel/ControlsTabView";
import FlowChartTab, {
  FlowChartTabLoader,
} from "./feature/flow_chart_panel/FlowChartTabView";
import ResultsTab from "./feature/results_panel/ResultsTabView";

import { useDisclosure } from "@mantine/hooks";
import { GlobalStyles } from "./feature/common/Global";

import {
  ColorScheme,
  ColorSchemeProvider,
  MantineProvider,
} from "@mantine/core";
import {
  RouterProvider,
  createBrowserRouter,
  useRouteError,
} from "react-router-dom";
import "./App.css";
import { CustomFonts } from "./feature/common/CustomFonts";
import PreJobOperationShow from "./feature/common/PreJobOperationShow";
import { darkTheme, lightTheme } from "./feature/common/theme";
import { useFlowChartState } from "./hooks/useFlowChartState";
import { useSocket } from "./hooks/useSocket";
import useKeyboardShortcut from "./hooks/useKeyboardShortcut";
import { ErrorPage } from "./ErrorPage";

function ErrorBoundary() {
  const error: Error = useRouteError() as Error;
  return (
    <ErrorPage error={error} resetErrorBoundary={() => location.reload()} />
  );
}

const router = createBrowserRouter([
  {
    path: "/",
    loader: FlowChartTabLoader,
    errorElement: <ErrorBoundary />,
    element: <FlowChartTab />,
  },
  {
    path: "/controls",
    loader: ControlsTabLoader,
    errorElement: <ErrorBoundary />,
    element: <ControlsTab />,
  },
  {
    path: "/debug",
    errorElement: <ErrorBoundary />,
    element: <ResultsTab />,
  },
]);

const App = () => {
  const {
    states: { runningNode, failedNode, preJobOperation },
  } = useSocket();
  const [theme, setTheme] = useState<ColorScheme>("dark");

  const { setRunningNode, setFailedNode, setIsSidebarOpen } =
    useFlowChartState();
  const [
    isPrejobModalOpen,
    { open: openPreJobModal, close: closePreJobModal },
  ] = useDisclosure(false);

  const toggleColorScheme = (color?: ColorScheme) => {
    setTheme(color || (theme === "dark" ? "light" : "dark"));
  };

  useEffect(() => {
    setRunningNode(runningNode);
    setFailedNode(failedNode);
  }, [runningNode, failedNode, setRunningNode, setFailedNode]);

  useEffect(() => {
    if (preJobOperation.isRunning) {
      openPreJobModal();
    } else {
      closePreJobModal();
    }
  }, [preJobOperation]);

  useKeyboardShortcut("ctrl", "a", () => setIsSidebarOpen((prev) => !prev));

  return (
    <ColorSchemeProvider
      colorScheme={theme}
      toggleColorScheme={toggleColorScheme}
    >
      <MantineProvider
        withGlobalStyles
        withNormalizeCSS
        theme={theme === "dark" ? darkTheme : lightTheme}
      >
        <GlobalStyles />
        <PreJobOperationShow
          opened={isPrejobModalOpen}
          outputs={preJobOperation.output}
          close={closePreJobModal}
        />
        <CustomFonts />
        <RouterProvider router={router} />
      </MantineProvider>
    </ColorSchemeProvider>
  );
};

export default App;
