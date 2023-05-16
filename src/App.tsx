import { useCallback, useEffect, useState } from "react";

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
import { useInterval } from "react-use";
import "./App.css";
import { ServerStatus } from "./ServerStatus";
import { CustomFonts } from "./feature/common/CustomFonts";
import PreJobOperationShow from "./feature/common/PreJobOperationShow";
import { darkTheme, lightTheme } from "./feature/common/theme";
import { CtlManifestType, useFlowChartState } from "./hooks/useFlowChartState";
import { useSocket } from "./hooks/useSocket";
import { saveFlowChartToLocalStorage } from "./services/FlowChartServices";

const router = createBrowserRouter([
  {
    path: "/",
    element: <FlowChartTab />, // TODO: Add sidebar back to this tab
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
  const { states } = useSocket();
  const { runningNode, failedNode, preJobOperation } = states!;
  const [theme, setTheme] = useState<ColorScheme>("dark");
  const {
    rfInstance,
    setRunningNode,
    setFailedNode,
    setCtrlsManifest,
    loadFlowExportObject,
  } = useFlowChartState();
  const [
    isPrejobModalOpen,
    { open: openPreJobModal, close: closePreJobModal },
  ] = useDisclosure(false);
  const queryString = window?.location?.search;
  const fileName =
    queryString.startsWith("?test_example_app") && queryString.split("=")[1];

  const toggleColorScheme = (color?: ColorScheme) => {
    setTheme(color || (theme === "dark" ? "light" : "dark"));
  };

  function cacheManifest(manifest: CtlManifestType[]) {
    setCtrlsManifest(manifest);
  }

  const fetchExampleApp = useCallback(
    async (fileName: string) => {
      const res = await fetch(`/example-apps/${fileName}`, {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      });
      const data = await res.json();
      setCtrlsManifest(data.ctrlsManifest);
      const flow = data.rfInstance;
      loadFlowExportObject(flow);
    },
    [loadFlowExportObject, setCtrlsManifest]
  );

  useEffect(() => {
    console.log("1");
    setRunningNode(runningNode);
    setFailedNode(failedNode);
  }, [runningNode, failedNode, setRunningNode, setFailedNode]);

  useEffect(() => {
    console.log("2");
    if (fileName) {
      fetchExampleApp(fileName);
    }
  }, [fileName, fetchExampleApp]);

  useEffect(() => {
    console.log("3");
    if (preJobOperation.isRunning) {
      openPreJobModal();
    } else {
      closePreJobModal();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [preJobOperation]);

  // TODO: Find a better way to do this?
  useInterval(() => saveFlowChartToLocalStorage(rfInstance), 5000);

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
