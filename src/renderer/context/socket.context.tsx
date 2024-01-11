import { NodeResult } from "@src/routes/common/types/ResultsType";
import { SetStateAction, useSetAtom } from "jotai";
import {
  createContext,
  Dispatch,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import { WebSocketServer } from "../web-socket/socket";
import { v4 as UUID } from "uuid";
import { SOCKET_URL } from "@src/data/constants";
import { useHardwareRefetch } from "@src/hooks/useHardwareDevices";
import {
  manifestChangedAtom,
  useFetchManifest,
  useFetchNodesMetadata,
} from "@src/hooks/useManifest";
import { toast } from "sonner";
import { useCustomSections } from "@src/hooks/useCustomBlockManifest";
import { User } from "src/types/auth";
import useAuth from "@src/hooks/useAuth";

type States = {
  programResults: NodeResult[];
  setProgramResults: Dispatch<SetStateAction<NodeResult[]>>;
  runningNode: string;
  serverStatus: IServerStatus;
  failedNodes: Record<string, string>;
  socketId: string;
  logs: string[];
  user: User | null;
  setUser: Dispatch<SetStateAction<User | null>>;
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

export const SocketContext = createContext<{ states: States } | null>(null);

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
  const { handleImportCustomBlocks } = useCustomSections();
  const fetchManifest = useFetchManifest();
  const fetchMetadata = useFetchNodesMetadata();
  const setManifestChanged = useSetAtom(manifestChangedAtom);
  const [user, setUser] = useState<User | null>(null);
  const { users } = useAuth();

  const handleStateChange =
    (state: keyof States) =>
    (value: string | number | Record<string, string> | IServerStatus) => {
      setStates((prev) => ({
        ...prev,
        [state]: value,
      }));
    };

  const authenticateUser = useCallback(() => {
    const loggedUser = users.find((u) => u.logged);
    setUser(loggedUser ?? users[0]);
  }, [users]);

  useEffect(() => {
    if (!socket) {
      console.log("Creating new WebSocket connection to backend");
      const socketId = UUID();
      const ws = new WebSocketServer({
        url: `${SOCKET_URL}/${socketId}`,
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
          hardwareRefetch();
          fetchManifest();
          fetchMetadata();
          handleImportCustomBlocks(true);
        },
        onManifestUpdate: () => {
          fetchManifest();
          fetchMetadata();
          handleImportCustomBlocks(true);
          setManifestChanged(true);
          toast("Changes detected, syncing blocks with changes...");
        },
      });
      setSocket(ws);
    }
  }, [
    fetchManifest,
    fetchMetadata,
    hardwareRefetch,
    socket,
    setManifestChanged,
    handleImportCustomBlocks,
  ]);
  useEffect(() => {
    authenticateUser();
  }, [authenticateUser, users]);
  const values = useMemo(
    () => ({
      states: {
        ...states,
        programResults,
        setProgramResults,
        logs,
        user,
        setUser,
      },
    }),
    [programResults, states, logs, user, setUser],
  );
  return (
    <SocketContext.Provider value={values}>{children}</SocketContext.Provider>
  );
};
