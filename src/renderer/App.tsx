import { useRouteError, Route, Routes } from "react-router-dom";
import "./App.css";
import { ErrorPage } from "@/renderer/ErrorPage";
import FlowChartTab from "./routes/flow_chart/FlowChartTabView";
import TestSequencerTab from "./routes/test_sequencer_panel/TestSequencerView";
import DeviceTab from "./routes/device_panel/DeviceView";
import ControlPanelTab from "./routes/control_panel/control-panel-view";
import { useTheme } from "@/renderer/providers/theme-provider";
import { Layout } from "./routes/common/Layout";
import { Index } from "./routes/index";
// eslint-disable-next-line no-restricted-imports
import packageJson from "../../package.json";
import EditorView from "./routes/editor/EditorView";
import AuthPage from "./routes/auth/Auth";
import { Toaster } from "sonner";
import { SocketReceiver } from "./socket-receiver";

function ErrorBoundary() {
  const error: Error = useRouteError() as Error;
  return (
    <ErrorPage error={error} resetErrorBoundary={() => location.reload()} />
  );
}

const App = () => {
  const { resolvedTheme } = useTheme();

  return (
    <div>
      <Toaster theme={resolvedTheme} richColors closeButton />
      <SocketReceiver />
      <div className="titlebar flex h-12 items-center justify-center bg-background font-bold">
        Flojoy Studio ({packageJson.version})
      </div>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/auth" element={<AuthPage startup />} />
        <Route
          path="/auth/user-switch"
          element={<AuthPage startup={false} />}
        />
        <Route path="/" element={<Layout />}>
          <Route
            path="/test-sequencer"
            element={<TestSequencerTab />}
            errorElement={<ErrorBoundary />}
          />
          <Route
            path="/flowchart"
            element={<FlowChartTab />}
            errorElement={<ErrorBoundary />}
          />
          <Route
            path="/control"
            element={<ControlPanelTab />}
            errorElement={<ErrorBoundary />}
          />
          <Route
            path="/devices"
            element={<DeviceTab />}
            errorElement={<ErrorBoundary />}
          />
        </Route>
        <Route path="/editor/:id" element={<EditorView />} />
      </Routes>
    </div>
  );
};

export default App;
