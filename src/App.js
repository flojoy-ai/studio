import React, { useState, useEffect } from "react";

import FlowChart from "./components/flow_chart_panel/ReactFlow.tsx";
import ResultsTab from "./components/results_panel/ResultsTab.tsx";
import ControlsTab from "./components/controls_panel/ControlsTab.tsx";

import { ThemeProvider } from "styled-components";
import { lightTheme, darkTheme } from "./components/theme";
import { GlobalStyles } from "./components/global";

import STATUS_CODES from "./STATUS_CODES.json";

import "./App.css";
import { useFlowChartState } from "./hooks/useFlowChartState";
import { ReactFlowProvider, removeElements } from "react-flow-renderer";
import Controls from "./components/flow_chart_panel/ControlBar";
import { DarkIcon, LightIcon } from "./utils/themeIconSvg";
import { useWindowSize } from "react-use";
// import { useSocket } from "./hooks/useSocket";

const App = () => {
  const [serverStatus, setServerStatus] = useState("Connecting to server...");
  // const {serverStatus, programResults} = useSocket();
  const [openCtrlModal, setOpenCtrlModal] = useState(false);
  const [programResults, setProgramResults] = useState({
    msg: STATUS_CODES.NO_RUNS_YET,
  });
  const [theme, setTheme] = useState("dark");
  const [clickedElement, setClickedElement] = useState(null);

  const {
    elements,
    setElements,
    rfInstance,
    setRfInstance,
    setUiTheme,
    showLogs,
  } = useFlowChartState();
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

  const pingBackendAPI = async (endpoint) => {
    const resp = await fetch(endpoint);
    const body = await resp.json();
    if (resp.status !== 200) {
      throw Error(body.message);
    }
    return body;
  };
  const onElementsRemove = (elementsToRemove) =>
    setElements((els) => removeElements(elementsToRemove, els));
console.log(' program result: ', 'io' in programResults && JSON.parse(programResults.io))
  useEffect(() => {
    console.log("App component did mount");

    pingBackendAPI("/ping")
      .then((res) => {
        if ("msg" in res) {
          setServerStatus(res.msg);
          // set a timer that gets an update from the server every second
          window.setInterval(() => {
            pingBackendAPI("/heartbeat").then((res) => {
              // console.log('heartbeat', res);
              if (res.msg === STATUS_CODES["RQ_RUN_COMPLETE"]) {
                // grab program result from redis
                setServerStatus(STATUS_CODES["RQ_RUN_COMPLETE"]);
                console.log(STATUS_CODES["RQ_RUN_COMPLETE"]);
                pingBackendAPI("/io").then((res) => {
                  console.log("io", res);
                  if (res.msg === STATUS_CODES["MISSING_RQ_RESULTS"]) {
                    setServerStatus(res.msg);
                  } else {
                    setServerStatus(STATUS_CODES["RQ_RESULTS_RETURNED"]);
                    console.log("setting results state", res);
                    setProgramResults(res);

                    console.warn("new program results", programResults);
                  }
                });
              } else if (res.msg !== undefined && res.msg !== "") {
                // Program in process, awaiting a new job etc...
                setServerStatus(res.msg);
              }
            });
          }, 100);
        } else {
          setServerStatus(STATUS_CODES["SERVER_OFFLINE"]);
        }
      })
      .catch((err) => console.log(err));
  }, []);

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
            className=" App-tabs flex"
            style={{
              width: windowWidth <= 700 ? "100%" : "750px",
            }}
          >
            <h1 className="App-brand">FLOJOY</h1>
            <a
              onClick={() => setCurrentTab("visual")}
              className={currentTab !== "panel" ? "active-" + theme : ""}
              style={{
                ...(windowWidth <= 700 && {
                  minHeight: "55px",
                }),
              }}
            >
              SCRIPT
              {/* {windowWidth >= 1080 ? "VISUAL PYTHON SCRIPT" : "SCRIPT"} */}
            </a>
            <a
              onClick={() => setCurrentTab("panel")}
              className={currentTab === "panel" ? "active-" + theme : ""}
              style={{
                ...(windowWidth <= 700 && {
                  minHeight: "55px",
                }),
              }}
            >
              CTRLS
              {/* {windowWidth >= 1080 ? "CTRL PANEL" : "CTRLS"} */}
            </a>
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
          <div style={{display:showLogs ? 'block' : 'none'}}>
          <ResultsTab results={programResults} theme={theme} />
          </div>
          <div style={{display: !showLogs && currentTab !== 'panel' ? 'block' : 'none'}}>
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
          {!showLogs && currentTab === 'panel' && <ControlsTab
              results={programResults}
              theme={theme}
              programResults={programResults}
              openCtrlModal={openCtrlModal}
              setOpenCtrlModal={setOpenCtrlModal}
            />}
          {/* {showLogs ? (
            <ResultsTab results={programResults} theme={theme} />
          ) : currentTab !== "panel" ? (
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
          ) : (
            <ControlsTab
              results={programResults}
              theme={theme}
              programResults={programResults}
              openCtrlModal={openCtrlModal}
              setOpenCtrlModal={setOpenCtrlModal}
            />
          )} */}

          {/* <Tabs forceRenderTabPanel={true}>
            <TabList>
              <Tab>VISUAL PYTHON SCRIPT</Tab>
              <Tab>CTRL PANEL</Tab>
              <li
                style={{
                  display: "inline-flex",
                  gap: 12,
                  paddingLeft: "6px",
                  paddingRight: "6px",
                  fontSize: 16,
                }}
              >
                <Controls
                  rfInstance={rfInstance}
                  setElements={setElements}
                  clickedElement={clickedElement}
                  onElementsRemove={onElementsRemove}
                  theme={theme}
                />
              </li>
              <Tab style={{ float: "right" }}>LOGS</Tab>
            </TabList>

            <TabPanel key="tab-1">
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
            </TabPanel>

            <TabPanel key="tab-2">
              <ControlsTab results={programResults} theme={theme} />
            </TabPanel>

            <TabPanel key="tab-3" style={{ backgroundColor: "#282c34" }}>
              <ResultsTab results={programResults} theme={theme} />
            </TabPanel>
          </Tabs> */}
        </main>
      </ReactFlowProvider>
    </ThemeProvider>
  );
};

export default App;
