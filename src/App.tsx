import { useEffect, useState } from "react";

import { useDisclosure } from "@mantine/hooks";
import { GlobalStyles } from "./feature/common/Global";
import {
  KBarAnimator,
  KBarPortal,
  KBarPositioner,
  KBarProvider,
  KBarSearch,
  KBarResults,
  useMatches,
} from "kbar";

import {
  ColorScheme,
  ColorSchemeProvider,
  MantineProvider,
} from "@mantine/core";
import { useRouteError, useNavigate, Route, Routes } from "react-router-dom";
import "./App.css";
import PreJobOperationShow from "./feature/common/PreJobOperationShow";
import { darkTheme, lightTheme } from "./feature/common/theme";
import { useFlowChartState } from "./hooks/useFlowChartState";
import { useSocket } from "./hooks/useSocket";
import useKeyboardShortcut from "./hooks/useKeyboardShortcut";
import { sendFrontEndLoadsToMix } from "@src/services/MixpanelServices";
import { ErrorPage } from "@src/ErrorPage";
import FlowChartTab from "./feature/flow_chart_panel/FlowChartTabView";

function ErrorBoundary() {
  const error: Error = useRouteError() as Error;
  return (
    <ErrorPage error={error} resetErrorBoundary={() => location.reload()} />
  );
}

function RenderResults() {
  const { results } = useMatches();

  return (
    <KBarResults
      items={results}
      onRender={({ item, active }) =>
        typeof item === "string" ? (
          <div>{item}</div>
        ) : (
          <div
            style={{
              background: active ? "#eee" : "transparent",
            }}
          >
            {item.name}
          </div>
        )
      }
    />
  );
}

const App = () => {
  const {
    states: { runningNode, failedNode, preJobOperation },
  } = useSocket();
  const [theme, setTheme] = useState<ColorScheme>("dark");
  const navigate = useNavigate();
  const actions = [
    {
      id: "main",
      name: "main",
      shortcut: [""],
      keywords: "",
      perform: () => navigate("/"),
    },
    {
      id: "ctrl",
      name: "ctrl",
      shortcut: [""],
      keywords: "",
      perform: () => navigate("/controls"),
    },
    {
      id: "debug",
      name: "debug",
      shortcut: [""],
      keywords: "",
      perform: () => navigate("/debug"),
    },
  ];
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

  useEffect(() => {
    sendFrontEndLoadsToMix();
  }, []);

  useKeyboardShortcut("ctrl", "b", () => setIsSidebarOpen((prev) => !prev));
  useKeyboardShortcut("meta", "b", () => setIsSidebarOpen((prev) => !prev));

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
        <div className={theme === "dark" ? "dark" : "light"}>
          <KBarProvider actions={actions}>
            <KBarPortal>
              <KBarPositioner>
                <KBarAnimator>
                  <KBarSearch />
                  <RenderResults />
                </KBarAnimator>
              </KBarPositioner>
            </KBarPortal>
            <GlobalStyles />
            <PreJobOperationShow
              opened={isPrejobModalOpen}
              outputs={preJobOperation.output}
              close={closePreJobModal}
            />
            <Routes>
              <Route
                path="/"
                element={<FlowChartTab />}
                errorElement={<ErrorBoundary />}
              />
            </Routes>
          </KBarProvider>
        </div>
      </MantineProvider>
    </ColorSchemeProvider>
  );
};

export default App;
