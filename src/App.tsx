import { useCallback, useEffect, useState } from "react";

import ControlsTab from "./feature/controls_panel/ControlsTabView";
import { v4 as uuidv4 } from "uuid";
import FlowChartTab from "./feature/flow_chart_panel/FlowChartTabView";
import ResultsTab from "./feature/results_panel/ResultsTabView";

import { GlobalStyles } from "./feature/common/Global";
import { useDisclosure } from "@mantine/hooks";

import {
  ColorScheme,
  ColorSchemeProvider,
  MantineProvider,
  useMantineTheme,
} from "@mantine/core";
import { Controls, Node } from "reactflow";
import "./App.css";
import { AppTab, Header } from "./Header";
import { ServerStatus } from "./ServerStatus";
import { CustomFonts } from "./feature/common/CustomFonts";
import { darkTheme, lightTheme } from "./feature/common/theme";
import Sidebar from "./feature/flow_chart_panel/SideBar/Sidebar";
import { CtlManifestType, useFlowChartState } from "./hooks/useFlowChartState";
import { useSocket } from "./hooks/useSocket";
import SidebarCustom from "./feature/common/Sidebar/Sidebar";
import {
  CTRL_MANIFEST,
  CTRL_TREE,
} from "./feature/controls_panel/manifest/CONTROLS_MANIFEST";
import { createStyles } from "@mantine/core";
import PreJobOperationShow from "./feature/common/PreJobOperationShow";
import { AddCTRLBtn } from "./AddCTRLBtn";
import { EditSwitch } from "./EditSwitch";
import { useInterval } from "react-use";
import { saveFlowChartToLocalStorage } from "./services/FlowChartServices";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import { Layout } from "./Layout";

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
  const { serverStatus, runningNode, failedNode, preJobOperation } = states!;
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
        <ServerStatus serverStatus={serverStatus} />
        <RouterProvider router={router} />
      </MantineProvider>
    </ColorSchemeProvider>
  );
};

export default App;
