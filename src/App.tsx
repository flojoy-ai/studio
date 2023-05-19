import { useEffect, useState } from "react";

import ControlsTab from "./feature/controls_panel/ControlsTabView";
import FlowChartTab from "./feature/flow_chart_panel/FlowChartTabView";
import ResultsTab from "./feature/results_panel/ResultsTabView";

import { useDisclosure } from "@mantine/hooks";
import { GlobalStyles } from "./feature/common/Global";

import {
  ColorScheme,
  ColorSchemeProvider,
  MantineProvider,
} from "@mantine/core";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import "./App.css";
import { CustomFonts } from "./feature/common/CustomFonts";
import PreJobOperationShow from "./feature/common/PreJobOperationShow";
import { darkTheme, lightTheme } from "./feature/common/theme";
import { useFlowChartState } from "./hooks/useFlowChartState";
import { useSocket } from "./hooks/useSocket";

const router = createBrowserRouter([
  {
    path: "/",
    element: <FlowChartTab />,
  },
  {
    path: "/controls",
    element: <ControlsTab />,
  },
  {
    path: "/debug",
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
    console.log("1");
    setRunningNode(runningNode);
    setFailedNode(failedNode);
  }, [runningNode, failedNode, setRunningNode, setFailedNode]);

  useEffect(() => {
    console.log("3");
    if (preJobOperation.isRunning) {
      openPreJobModal();
    } else {
      closePreJobModal();
    }
  }, [preJobOperation]);

  // TODO: I will move this into a hook tomorrow, signing off for now
  const handleShortcut = (event: any) => {
    if ((event.metaKey || event.ctrlKey) && event.key === "a") {
      event.preventDefault();
      setIsSidebarOpen((prev) => !prev);
    }
  };
  useEffect(() => {
    document.addEventListener("keydown", handleShortcut);
    return () => {
      document.removeEventListener("keydown", handleShortcut);
    };
  }, []);

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
