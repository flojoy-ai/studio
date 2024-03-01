import { BlockResult } from "@/renderer/routes/common/types/ResultsType";
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
import { ServerStatus, WorkerJobResponse } from "@/renderer/types/socket";
import { sendEventToMix } from "@/renderer/services/MixpanelServices";
import { useSocketStore } from "@/renderer/stores/socket";

type SocketState = {
  runningNode: string;
  serverStatus: ServerStatus;
  blockResults: Record<string, BlockResult>;
  failedNodes: Record<string, string>;
  wipeBlockResults: () => void;
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
  const {
    runningNode,

    blockResults,
    serverStatus,
    failedNodes,
    socketId,
    logs,

    processWorkerResponse,
    setServerStatus,
    wipeBlockResults,
    setSocketId,
  } = useSocketStore(
    useShallow((state) => ({
      runningNode: state.runningNode,
      blockResults: state.blockResults,
      serverStatus: state.serverStatus,
      failedNodes: state.failedNodes,
      socketId: state.socketId,
      logs: state.logs,

      processWorkerResponse: state.processWorkerResponse,
      setServerStatus: state.setServerStatus,
      wipeBlockResults: state.wipeBlockResults,
      setSocketId: state.setSocketId,
    })),
  );

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
    if (socket !== undefined) return;
    const ws = new WebSocket(
      `ws://${env.VITE_BACKEND_HOST}:${env.VITE_BACKEND_PORT}/ws/${UUID()}`,
    );
    ws.onmessage = (ev) => {
      const data = JSON.parse(ev.data);
      switch (data.type) {
        case "worker_response": {
          // const res = WorkerJobResponse.safeParse(data);
          // if (!res.success) {
          //   console.log(
          //     "failed to validate worker response: ",
          //     res.error.message,
          //   );
          //   return;
          // }
          processWorkerResponse(data);
          break;
        }
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
  }, [
    hardwareRefetch,
    setManifestChanged,
    importCustomBlocks,
    fetchDriverDevices,
    fetchDMMDevices,
    doFetch,
    doImport,
    socket,
    setSocketId,
    processWorkerResponse,
    setServerStatus,
  ]);

  const values: SocketState = useMemo(
    () => ({
      socketId,
      runningNode,
      serverStatus,
      failedNodes,
      blockResults,
      wipeBlockResults,
      logs,
    }),
    [
      socketId,
      runningNode,
      serverStatus,
      failedNodes,
      blockResults,
      wipeBlockResults,
      logs,
    ],
  );
  return (
    <SocketContext.Provider value={values}>{children}</SocketContext.Provider>
  );
};
