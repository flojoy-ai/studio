import { FC, useCallback, useEffect, useState } from "react";

import FlowChartTab from "./feature/flow_chart_panel/FlowChartTabView";
import ResultsTab from "./feature/results_panel/ResultsTabView";
import ControlsTab from "./feature/controls_panel/ControlsTabView";

import { ThemeProvider } from "styled-components";
import { lightTheme, darkTheme } from "./feature/common/theme";
import { GlobalStyles } from "./feature/common/global";

import "./App.css";
import { useFlowChartState } from "./hooks/useFlowChartState";
import { Node } from "reactflow";
import Controls from "./feature/flow_chart_panel/views/ControlBar";
import { DarkIcon, LightIcon } from "./utils/ThemeIconSvg";
import { useWindowSize } from "react-use";
import { useSocket } from "./hooks/useSocket";

const App = () => {
  const { states } = useSocket();
  const { serverStatus, programResults, runningNode, failedNode } = states!;
  const [openCtrlModal, setOpenCtrlModal] = useState(false);
  const [theme, setTheme] = useState<"dark" | "light">("dark");
  const [clickedElement, setClickedElement] = useState<Node | undefined>(
    undefined
  );
  const {
    rfInstance,
    setRfInstance,
    setUiTheme,
    setRunningNode,
    setFailedNode,
    setCtrlsManifest,
    setGridLayout,
    loadFlowExportObject,
  } = useFlowChartState();
  const [currentTab, setCurrentTab] = useState<"visual" | "panel" | "debug">(
    "visual"
  );
  const { width: windowWidth } = useWindowSize();
  const queryString = window?.location?.search;
  const fileName =
    queryString.startsWith("?test_example_app") && queryString.split("=")[1];
  const toggleTheme = () => {
    if (theme === "light") {
      setTheme("dark");
      setUiTheme("dark");
    } else {
      setTheme("light");
      setUiTheme("light");
    }
  };

  const fetchExampleApp = useCallback(
    (fileName: string) => {
      fetch("/example-apps/" + fileName, {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      })
        .then((res) => {
          return res.json();
        })
        .then((data) => {
          setCtrlsManifest(data.ctrlsManifest);
          const flow = data.rfInstance;
          loadFlowExportObject(flow);
        })
        .catch((err) => console.log("fetch example app err: ", err));
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [fileName]
  );

  useEffect(() => {
    setRunningNode(runningNode);
    setRunningNode(runningNode);
    setFailedNode(failedNode);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [runningNode, failedNode]);
  useEffect(() => {
    if (fileName) {
      fetchExampleApp(fileName);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fileName]);

  return (
    <ThemeProvider theme={theme === "light" ? lightTheme : darkTheme}>
      <GlobalStyles />
      <p
        className="App-status"
        data-cy="app-status"
        style={{
          backgroundColor: theme === "dark" ? "#14131361" : "#58454517",
        }}
      >
        <code>{serverStatus}</code>
      </p>
      <header
        className={`flex App-header border-color  ${
          theme === "dark" && "dark"
        }`}
        style={{
          ...(windowWidth <= 700 && {
            flexDirection: "column",
            height: "fit-content",
          }),
        }}
      >
        <div
          className="App-tabs flex"
          style={{
            width: windowWidth <= 700 ? "100%" : "750px",
          }}
        >
          <h1 className="App-brand">FLOJOY</h1>
          <button
            onClick={() => setCurrentTab("visual")}
            className={currentTab === "visual" ? "active-" + theme : ""}
            style={{
              ...(windowWidth <= 700 && {
                minHeight: "55px",
              }),
              color: theme === "dark" ? "#fff" : "#000",
            }}
            data-cy="script-btn"
          >
            SCRIPT
          </button>
          <button
            onClick={() => setCurrentTab("panel")}
            className={currentTab === "panel" ? "active-" + theme : ""}
            style={{
              ...(windowWidth <= 700 && {
                minHeight: "55px",
              }),
              color: theme === "dark" ? "#fff" : "#000",
            }}
            data-cy="ctrls-btn"
          >
            CTRLS
          </button>
          <button
            className={currentTab === "debug" ? "active-" + theme : ""}
            onClick={() => setCurrentTab("debug")}
            style={{
              color: theme === "dark" ? "#fff" : "#000",
            }}
            data-cy="debug-btn"
          >
            DEBUG
          </button>
        </div>
        <div
          className="flex App-control-buttons"
          style={{
            width:
              windowWidth >= 1080
                ? "750px"
                : windowWidth <= 700
                ? "100%"
                : "420px",
          }}
        >
          <Controls
            theme={theme}
            activeTab={currentTab}
            setOpenCtrlModal={setOpenCtrlModal}
          />
          <button onClick={toggleTheme} className="App-theme-toggle">
            {theme === "light" ? <LightIcon /> : <DarkIcon />}
          </button>
        </div>
      </header>
      <main style={{ minHeight: "85vh" }}>
        <div style={{ display: currentTab === "visual" ? "block" : "none" }}>
          <FlowChartTab
            rfInstance={rfInstance!}
            setRfInstance={setRfInstance}
            results={programResults!}
            theme={theme}
            clickedElement={clickedElement}
            setClickedElement={setClickedElement}
          />
        </div>
        <div style={{ display: currentTab === "panel" ? "block" : "none" }}>
          <ControlsTab
            results={programResults}
            theme={theme}
            openCtrlModal={openCtrlModal}
            setOpenCtrlModal={setOpenCtrlModal}
          />
        </div>
        <div style={{ display: currentTab === "debug" ? "block" : "none" }}>
          <ResultsTab results={programResults!} />
        </div>
      </main>
    </ThemeProvider>
  );
};

export default App;
