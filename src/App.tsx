import { useCallback, useEffect, useState } from "react";

import ControlsTab from "./feature/controls_panel/ControlsTabView";
import FlowChartTab from "./feature/flow_chart_panel/FlowChartTabView";
import ResultsTab from "./feature/results_panel/ResultsTabView";

import { GlobalStyles } from "./feature/common/Global";
import { useDisclosure } from "@mantine/hooks";
import { v4 as uuidv4 } from "uuid";

import {
  ColorScheme,
  ColorSchemeProvider,
  MantineProvider,
  useMantineTheme,
} from "@mantine/core";
import { Node } from "reactflow";
import "./App.css";
import { AppTab, Header } from "./Header";
import { ServerStatus } from "./ServerStatus";
import { CustomFonts } from "./feature/common/CustomFonts";
import { darkTheme, lightTheme } from "./feature/common/theme";
import { CtlManifestType, useFlowChartState } from "./hooks/useFlowChartState";
import { useSocket } from "./hooks/useSocket";
import { SidebarCustom } from "./feature/common/Sidebar/Sidebar";
import {
  CTRL_MANIFEST,
  CTRL_TREE,
} from "./feature/controls_panel/manifest/CONTROLS_MANIFEST";
import { createStyles } from "@mantine/core";
import PreJobOperationShow from "./feature/common/PreJobOperationShow";
import { AddCTRLBtn } from "./AddCTRLBtn";
import { EditSwitch } from "./EditSwitch";
import { AddNodeBtn } from "./AddNodeBtn";
import {
  CMND_MANIFEST,
  CMND_TREE,
} from "./feature/flow_chart_panel/manifest/COMMANDS_MANIFEST";
import { useAddNewNode } from "./feature/flow_chart_panel/hooks/useAddNewNode";
import { RequestNode } from "./feature/flow_chart_panel/components/RequestNode";

const App = () => {
  const addNewNode = useAddNewNode();
  const { states } = useSocket();
  const {
    serverStatus,
    programResults,
    runningNode,
    failedNode,
    preJobOperation,
  } = states!;
  const [openCtrlModal, setOpenCtrlModal] = useState(false);
  const [theme, setTheme] = useState<ColorScheme>("dark");
  const [isCTRLSideBarOpen, setCTRLSideBarStatus] = useState(false); //for ctrl sidebar
  const [isSCRIPTSideBarOpen, setSCRIPTSideBarStatus] = useState(false); //for script sidebar
  const [clickedElement, setClickedElement] = useState<Node | undefined>(
    undefined
  );
  const {
    rfInstance,
    setRfInstance,
    setRunningNode,
    setFailedNode,
    setCtrlsManifest,
    gridLayout,
    loadFlowExportObject,
    isEditMode,
    setIsEditMode,
    ctrlsManifest,
  } = useFlowChartState();
  const [currentTab, setCurrentTab] = useState<AppTab>("visual");
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

  //function for handling a CTRL add (assume that input is key from manifest)
  const addCtrl = (ctrlKey: string) => {
    setCTRLSideBarStatus(false); //close the sidebar when adding a ctrl
    const ctrlObj = CTRL_MANIFEST[ctrlKey];
    const id = `ctrl-${uuidv4()}`;
    let yAxis = 0;
    for (const el of gridLayout) {
      if (yAxis < el.y) {
        yAxis = el.y;
      }
    }
    const ctrlLayout = {
      x: 0,
      y: yAxis + 1,
      h: ctrlObj.minHeight! > 2 ? ctrlObj.minHeight : 2,
      w: 2,
      i: id,
      minH: ctrlObj.minHeight,
      minW: ctrlObj.minWidth,
      static: !isEditMode,
    };
    const ctrl: CtlManifestType = {
      ...ctrlObj,
      hidden: false,
      id,
      layout: ctrlLayout,
    } as CtlManifestType;

    cacheManifest([...ctrlsManifest, ctrl]);
  };

  useEffect(() => {
    setRunningNode(runningNode);
    setFailedNode(failedNode);
  }, [runningNode, failedNode, setRunningNode, setFailedNode]);

  useEffect(() => {
    if (fileName) {
      fetchExampleApp(fileName);
    }
  }, [fileName, fetchExampleApp]);
  useEffect(() => {
    if (preJobOperation.isRunning) {
      openPreJobModal();
    } else {
      closePreJobModal();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [preJobOperation]);

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
        <Header
          currentTab={currentTab}
          setCurrentTab={setCurrentTab}
          setOpenCtrlModal={setOpenCtrlModal}
        />
        <main style={{ minHeight: "85vh" }}>
          <div style={{ display: currentTab === "visual" ? "block" : "none" }}>
            {/* add node button currently in the sidebar, to be refactored */}
            <AddNodeBtn
              setSCRIPTSideBarStatus={setSCRIPTSideBarStatus}
              isSCRIPTSideBarOpen={isSCRIPTSideBarOpen}
            />

            <SidebarCustom
              sections={CMND_TREE}
              manifestMap={CMND_MANIFEST}
              leafNodeClickHandler={addNewNode}
              isSideBarOpen={isSCRIPTSideBarOpen}
              setSideBarStatus={setSCRIPTSideBarStatus}
              customContent={<RequestNode />}
            />

            <FlowChartTab
              rfInstance={rfInstance!}
              setRfInstance={setRfInstance}
              results={programResults!}
              clickedElement={clickedElement}
              setClickedElement={setClickedElement}
            />
          </div>

          {/* Tab view containing controls */}
          <div style={{ display: currentTab === "panel" ? "block" : "none" }}>
            <div
              className="top-row"
              style={{
                display: "flex",
                justifyContent: "space-between",
              }}
            >
              <AddCTRLBtn
                setCTRLSideBarStatus={setCTRLSideBarStatus}
                setIsEditMode={setIsEditMode}
                isCTRLSideBarOpen={isCTRLSideBarOpen}
              />
              <EditSwitch
                isEditMode={isEditMode}
                setIsEditMode={setIsEditMode}
              />
            </div>

            <SidebarCustom
              sections={CTRL_TREE}
              manifestMap={CTRL_MANIFEST}
              leafNodeClickHandler={addCtrl}
              isSideBarOpen={isCTRLSideBarOpen}
              setSideBarStatus={setCTRLSideBarStatus}
            />

            <ControlsTab results={programResults!} />
          </div>

          {/*  */}
          <div style={{ display: currentTab === "debug" ? "block" : "none" }}>
            <ResultsTab results={programResults!} />
          </div>
        </main>
      </MantineProvider>
    </ColorSchemeProvider>
  );
};

export default App;
