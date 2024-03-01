import { NodeResult } from "@/renderer/routes/common/types/ResultsType";
import {
  createContext,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import { WebSocketServer } from "../web-socket/socket";
import { v4 as UUID } from "uuid";
import { useHardwareRefetch } from "@/renderer/hooks/useHardwareDevices";
import { toast } from "sonner";
import { env } from "@/env";
import { useSettingsStore } from "@/renderer/stores/settings";
import { useManifestStore } from "@/renderer/stores/manifest";
import { useShallow } from "zustand/react/shallow";
import { HTTPError } from "ky";
import { ZodError } from "zod";

type SocketState = {
  programResults: NodeResult[];
  resetProgramResults: () => void;
  runningNode: string;
  serverStatus: IServerStatus;
  failedNodes: Record<string, string>;
  socketId: string;
  logs: string[];
};

export enum IServerStatus {
  OFFLINE = "🛑 server offline",
  CONNECTING = "Connecting to server...",
  RUN_IN_PROCESS = "🏃‍♀️ running script...",
  RUN_COMPLETE = "🤙 python script run successful",
  MISSING_RESULTS = "👽 no result found",
  JOB_IN_QUEUE = "🎠 queuing python job= ",
  RESULTS_RETURNED = "🔔 new results - check LOGS",
  STANDBY = "🐢 awaiting a new job",
  SERVER_ONLINE = "🏁 node server online",
  NO_RUNS_YET = "⛷️ No runs yet",
}

const DEFAULT_STATES = {
  runningNode: "",
  serverStatus: IServerStatus.CONNECTING,
  failedNodes: {},
  socketId: "",
};

export const SocketContext = createContext<SocketState | null>(null);

export const SocketContextProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [socket, setSocket] = useState<WebSocketServer>();
  const [states, setStates] = useState(DEFAULT_STATES);
  const [programResults, setProgramResults] = useState<NodeResult[]>([]);
  const [logs, setLogs] = useState<string[]>([]);

  const hardwareRefetch = useHardwareRefetch();
  const { fetchManifest, importCustomBlocks, setManifestChanged } =
    useManifestStore(
      useShallow((state) => ({
        fetchManifest: state.fetchManifest,
        importCustomBlocks: state.importCustomBlocks,
        setManifestChanged: state.setManifestChanged,
      })),
    );

  const doFetch = useCallback(async () => {
    const res = await fetchManifest();
    if (res.isErr()) {
      toast.error("Failed to fetch manifest from server", {
        description: res.error.message,
      });
    }
  }, [fetchManifest]);

  const doImport = useCallback(async () => {
    const res = await importCustomBlocks(true);
    if (res.isOk()) {
      return;
    }

    if (res.error instanceof HTTPError) {
      toast.error("Error fetching custom blocks info.", {
        description: res.error.message,
      });
    } else if (res.error instanceof ZodError) {
      toast.error("Error fetching validating custom blocks info.", {
        description: "Check the console for more details.",
      });
      console.error(res.error.message);
    } else {
      toast.error("Error when trying to import custom blocks.", {
        description: res.error.message,
      });
    }
  }, [importCustomBlocks]);

  const deviceSettings = useSettingsStore((state) => state.device);

  const fetchDriverDevices = deviceSettings.niDAQmxDeviceDiscovery.value;
  const fetchDMMDevices = deviceSettings.nidmmDeviceDiscovery.value;

  const handleStateChange =
    (state: keyof SocketState) =>
    (value: string | number | Record<string, string> | IServerStatus) => {
      setStates((prev) => ({
        ...prev,
        [state]: value,
      }));
    };

  useEffect(() => {
    if (!socket) {
      console.log("Creating new WebSocket connection to backend");
      const socketId = UUID();
      const ws = new WebSocketServer({
        url: `ws://${env.VITE_BACKEND_HOST}:${env.VITE_BACKEND_PORT}/ws/${socketId}`,
        handleFailedNodes: handleStateChange("failedNodes"),
        handleRunningNode: handleStateChange("runningNode"),
        handleSocketId: handleStateChange("socketId"),
        onNodeResultsReceived: setProgramResults,
        onPingResponse: handleStateChange("serverStatus"),
        handleLogs: setLogs,
        onClose: (ev) => {
          console.log("socket closed with event:", ev);
          setSocket(undefined);
        },
        onConnectionEstablished: () => {
          hardwareRefetch(fetchDriverDevices, fetchDMMDevices);
          doFetch();
          doImport();
        },
        onManifestUpdate: () => {
          doFetch();
          doImport();
          setManifestChanged(true);
          toast("Changes detected, syncing blocks with changes...");
        },
      });
      setSocket(ws);
    }
  }, [
    hardwareRefetch,
    socket,
    setManifestChanged,
    importCustomBlocks,
    fetchDriverDevices,
    fetchDMMDevices,
    doFetch,
    doImport,
  ]);

  const values = useMemo(
    () => ({
      ...states,
      programResults,
      resetProgramResults: () => setProgramResults([]),
      logs,
    }),
    [programResults, states, logs],
  );
  return (
    <SocketContext.Provider value={values}>{children}</SocketContext.Provider>
  );
};
