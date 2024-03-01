import { NodeResult } from "@/renderer/routes/common/types/ResultsType";
import {
  createContext,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import { v4 as UUID } from "uuid";
import { useHardwareRefetch } from "@/renderer/hooks/useHardwareDevices";
import { toast } from "sonner";
import { env } from "@/env";
import { useSettingsStore } from "@/renderer/stores/settings";
import { useManifestStore } from "@/renderer/stores/manifest";
import { useShallow } from "zustand/react/shallow";
import { HTTPError } from "ky";
import { ZodError } from "zod";
import { ServerStatus } from "@/renderer/types/socket";
import { sendEventToMix } from "@/renderer/services/MixpanelServices";

type SocketState = {
  programResults: NodeResult[];
  resetProgramResults: () => void;
  runningNode: string;
  serverStatus: ServerStatus;
  failedNodes: Record<string, string>;
  socketId: string;
  logs: string[];
};

enum ResponseEnum {
  systemStatus = "SYSTEM_STATUS",
  nodeResults = "NODE_RESULTS",
  runningNode = "RUNNING_NODE",
  failedNodes = "FAILED_NODES",
  preJobOperation = "PRE_JOB_OP",
  log = "BACKEND_LOG",
}

export const SocketContext = createContext<SocketState | null>(null);

export const SocketContextProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [socket, setSocket] = useState<WebSocket>();
  const [socketId, setSocketId] = useState<string>("");
  const [serverStatus, setServerStatus] = useState<ServerStatus>(
    ServerStatus.CONNECTING,
  );
  const [runningNode, setRunningNode] = useState("");
  const [failedNodes, setFailedNodes] = useState<Record<string, string>>({});

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

  useEffect(() => {
    if (!socket) {
      console.log("Creating new WebSocket connection to backend");
      const socketId = UUID();
      const ws = new WebSocket(
        `ws://${env.VITE_BACKEND_HOST}:${env.VITE_BACKEND_PORT}/ws/${socketId}`,
      );
      ws.onmessage = (ev) => {
        const data = JSON.parse(ev.data);
        switch (data.type) {
          case "worker_response":
            if (ResponseEnum.systemStatus in data) {
              setServerStatus(data[ResponseEnum.systemStatus]);
              if (
                data[ResponseEnum.systemStatus] === ServerStatus.RUN_COMPLETE
              ) {
                setServerStatus(ServerStatus.STANDBY);
              }
            }
            if (ResponseEnum.nodeResults in data) {
              setProgramResults((prev) => {
                const resultIo = data[ResponseEnum.nodeResults];
                const isExist = prev.find((node) => node.id === resultIo.id);
                if (isExist) {
                  const filterResult = prev.filter(
                    (node) => node.id !== resultIo.id,
                  );
                  return [...filterResult, resultIo];
                }
                return [...prev, resultIo];
              });
            }
            if (ResponseEnum.runningNode in data) {
              setRunningNode(data[ResponseEnum.runningNode]);
            }
            if (ResponseEnum.failedNodes in data) {
              setFailedNodes(data[ResponseEnum.failedNodes]);
            }
            if (ResponseEnum.log in data) {
              setLogs((prev) => [...prev, data[ResponseEnum.log]]);
            }
            break;
          case "connection_established":
            setSocketId(data.socketId);
            if (ResponseEnum.systemStatus in data) {
              setServerStatus(data[ResponseEnum.systemStatus]);
            }
            hardwareRefetch(fetchDriverDevices, fetchDMMDevices);
            doFetch();
            doImport();
            sendEventToMix("Initial Status", {
              "Server Status": "Connection Established",
            });
            break;
          case "manifest_update":
            doFetch();
            doImport();
            setManifestChanged(true);
            toast("Changes detected, syncing blocks with changes...");
            break;
          default:
            console.log(" default data type: ", data);
            break;
        }
      };
      ws.onclose = (ev) => {
        console.log("socket closed with event:", ev);
        setSocket(undefined);
      };
      ws.onerror = (event) => {
        console.log("Error Event: ", event);
        setServerStatus(ServerStatus.OFFLINE);
      };
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
      socketId,
      runningNode,
      serverStatus,
      failedNodes,
      programResults,
      resetProgramResults: () => setProgramResults([]),
      logs,
    }),
    [socketId, runningNode, serverStatus, failedNodes, programResults, logs],
  );
  return (
    <SocketContext.Provider value={values}>{children}</SocketContext.Provider>
  );
};
