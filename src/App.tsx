import { useEffect, useState } from "react";

import FlowChartTab from "./feature/flow_chart_panel/FlowChartTabView"; //"./feature/flow_chart_panel/FlowChartTabView.tsx";
import ResultsTab from "./feature/results_panel/ResultsTabView";
import ControlsTab from "./feature/controls_panel/ControlsTabView";

import { ThemeProvider } from "styled-components";
import { lightTheme, darkTheme } from "./feature/common/theme";
import { GlobalStyles } from "./feature/common/global";

import "./App.css";
import { useFlowChartState } from "./hooks/useFlowChartState";
import { ReactFlowProvider } from "react-flow-renderer";
import Controls from "./feature/flow_chart_panel/views/ControlBar";
import { DarkIcon, LightIcon } from "./utils/ThemeIconSvg";
import { useWindowSize } from "react-use";
import { useSocket } from "./hooks/useSocket";

const App = () => {
  const {
    states: { serverStatus, programResults, runningNode, failedNodes },
  } = useSocket();
  const [openCtrlModal, setOpenCtrlModal] = useState(false);
  const [theme, setTheme] = useState<"dark" | "light">("dark");
  const [clickedElement, setClickedElement] = useState([]);
  const { elements, setElements, rfInstance, setRfInstance, setUiTheme } =
    useFlowChartState();
  const [currentTab, setCurrentTab] = useState<"visual" | "panel" | "debug">(
    "visual"
  );
  const { width: windowWidth } = useWindowSize();
  const toggleTheme = () => {
    if (theme === "light") {
      setTheme("dark");
      setUiTheme("dark");
    } else {
      setTheme("light");
      setUiTheme("light");
    }
  };

  useEffect(() => {
    setElements((prev) => {
      prev.forEach((el) => {
        if (el?.data?.func === runningNode) {
          el.data.running = true;
        } else {
          if (el.data?.running) {
            el.data.running = false;
          }
        }
        if (el?.data?.func && failedNodes.includes(el.data.func)) {
          el.data.failed = true;
        } else {
          if (el?.data?.failed) {
            el.data.failed = false;
          }
        }
      });
    });
  }, [runningNode, failedNodes]);
  const ReactFlowChartProvider: any = ReactFlowProvider;
  return (
    <ThemeProvider theme={theme === "light" ? lightTheme : darkTheme}>
      <ReactFlowChartProvider>
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
          <div style={{ display: currentTab === "debug" ? "block" : "none" }}>
            <ResultsTab results={programResults} />
          </div>
          <div style={{ display: currentTab === "visual" ? "block" : "none" }}>
            <FlowChartTab
              elements={elements}
              setElements={setElements}
              rfInstance={rfInstance}
              setRfInstance={setRfInstance}
              results={programResults}
              theme={theme}
              clickedElement={clickedElement}
              setClickedElement={setClickedElement}
            />
          </div>
          {currentTab === "panel" && (
            <ControlsTab
              results={programResults}
              theme={theme}
              openCtrlModal={openCtrlModal}
              setOpenCtrlModal={setOpenCtrlModal}
            />
          )}
        </main>
      </ReactFlowChartProvider>
    </ThemeProvider>
  );
};

export default App;
