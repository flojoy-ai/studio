import { useEffect, useState } from "react";

import FlowChart from "./feature/flow_chart_panel/ReactFlow.tsx";
import ResultsTab from "./feature/results_panel/ResultsTab.tsx";
import ControlsTab from "./components/controls_panel/ControlsTab.tsx";

import { ThemeProvider } from "styled-components";
import { lightTheme, darkTheme } from "./components/theme";
import { GlobalStyles } from "./components/global";

import "./App.css";
import { useFlowChartState } from "./hooks/useFlowChartState";
import { ReactFlowProvider, removeElements } from "react-flow-renderer";
import Controls from "./feature/flow_chart_panel/ControlBar";
import { DarkIcon, LightIcon } from "./utils/themeIconSvg";
import { useWindowSize } from "react-use";
import { useSocket } from "./hooks/useSocket";

const App = () => {
  const { serverStatus, programResults, runningNode } = useSocket();
  const [openCtrlModal, setOpenCtrlModal] = useState(false);
  const [theme, setTheme] = useState("dark");
  const [clickedElement, setClickedElement] = useState([]);

  const { elements, setElements, rfInstance, setRfInstance, setUiTheme } =
    useFlowChartState();
  const [currentTab, setCurrentTab] = useState("visual");
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

  const onElementsRemove = (elementsToRemove) =>
    setElements((els) => removeElements(elementsToRemove, els));

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
      });
    });
  }, [runningNode]);

  return (
    <ThemeProvider theme={theme === "light" ? lightTheme : darkTheme}>
      <ReactFlowProvider>
        <GlobalStyles />
        <p
          className="App-status"
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
              rfInstance={rfInstance}
              setElements={setElements}
              clickedElement={clickedElement}
              onElementsRemove={onElementsRemove}
              theme={theme}
              isVisualMode={currentTab === "visual"}
              setOpenCtrlModal={setOpenCtrlModal}
            />
            <button onClick={toggleTheme} className="App-theme-toggle">
              {theme === "light" ? <LightIcon /> : <DarkIcon />}
            </button>
          </div>
        </header>
        <main style={{ minHeight: "85vh" }}>
          <div style={{ display: currentTab === "debug" ? "block" : "none" }}>
            <ResultsTab results={programResults} theme={theme} />
          </div>
          <div style={{ display: currentTab === "visual" ? "block" : "none" }}>
            <FlowChart
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
              programResults={programResults}
              openCtrlModal={openCtrlModal}
              setOpenCtrlModal={setOpenCtrlModal}
            />
          )}
        </main>
      </ReactFlowProvider>
    </ThemeProvider>
  );
};

export default App;
