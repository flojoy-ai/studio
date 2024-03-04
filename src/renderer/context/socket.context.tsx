import { BlockResult } from "@/renderer/types/block-result";
import {
  createContext,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import { v4 as UUID } from "uuid";
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
import { useHardwareStore } from "@/renderer/stores/hardware";

type SocketState = {
  runningNode: string;
  serverStatus: string;
  blockResults: Record<string, BlockResult>;
  failedNodes: Record<string, string>;
  wipeBlockResults: () => void;
  socketId: string;
  logs: string[];
};

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

  const hardwareRefetch = useHardwareStore((state) => state.refresh);
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
    if (res.isOk()) return;

    if (res.error instanceof HTTPError) {
      toast.error("Error fetching custom blocks info.", {
        description: res.error.message,
      });
    } else if (res.error instanceof ZodError) {
      toast.error("Error fetching validating custom blocks info.", {
        description: "Check the console for more details.",
      });
      console.error(res.error.message);
    }
  }, [fetchManifest]);

  const deviceSettings = useSettingsStore((state) => state.device);

  const fetchDriverDevices = deviceSettings.niDAQmxDeviceDiscovery.value;
  const fetchDMMDevices = deviceSettings.nidmmDeviceDiscovery.value;

  const doHardwareFetch = useCallback(async () => {
    const res = await hardwareRefetch(fetchDriverDevices, fetchDMMDevices);
    if (res.isOk()) return;

    if (res.error instanceof ZodError) {
      toast.error("Error validating hardware info", {
        description: "Check the console for more info.",
      });
      console.error(res.error.message);
    } else if (res.error instanceof Error) {
      toast.error("Error fetching hardware info", {
        description: res.error.message,
      });
    }
  }, [fetchDMMDevices, fetchDriverDevices, hardwareRefetch]);

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
    }
  }, [importCustomBlocks]);

  useEffect(() => {
    if (socket !== undefined) return;
    const ws = new WebSocket(
      `ws://${env.VITE_BACKEND_HOST}:${env.VITE_BACKEND_PORT}/ws/${UUID()}`,
    );
    ws.onmessage = (ev) => {
      const msg = JSON.parse(ev.data);
      const res = WorkerJobResponse.safeParse(msg);
      if (!res.success) {
        console.error(
          "failed to validate worker response: ",
          res.error.message,
        );
        return;
      }
      const data = res.data;
      switch (data.type) {
        case "worker_response": {
          processWorkerResponse(data);
          break;
        }
        case "connection_established":
          if (data.socketId !== undefined) {
            setSocketId(data.socketId);
          }
          if (data.SYSTEM_STATUS) {
            setServerStatus(data.SYSTEM_STATUS);
          }
          doHardwareFetch();
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
