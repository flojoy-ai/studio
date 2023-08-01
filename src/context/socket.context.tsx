import { NodeResult } from "@src/feature/common/types/ResultsType";
import { SetStateAction } from "jotai";
import { createContext, Dispatch, useEffect, useState } from "react";
import { WebSocketServer } from "../web-socket/socket";
import { v4 as UUID } from "uuid";
import { SOCKET_URL } from "@src/data/constants";

type States = {
  programResults: NodeResult[];
  setProgramResults: Dispatch<SetStateAction<NodeResult[]>>;
  runningNode: string;
  serverStatus: IServerStatus;
  failedNode: string;
  failureReason: string;
  socketId: string;
  preJobOperation: {
    isRunning: boolean;
    output: string[];
  };
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
  failedNode: "",
  failureReason: "",
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
  const [preJobOperation, setPreJobOperation] = useState<
    States["preJobOperation"]
  >({
    isRunning: false,
    output: [],
  });

  const handleStateChange =
    (state: keyof States) => (value: string | number | IServerStatus) => {
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
        url: `${SOCKET_URL}/${socketId}`,
        handleFailedNode: handleStateChange("failedNode"),
        handleRunningNode: handleStateChange("runningNode"),
        handleSocketId: handleStateChange("socketId"),
        handleFailureReason: handleStateChange("failureReason"),
        onNodeResultsReceived: setProgramResults,
        onPingResponse: handleStateChange("serverStatus"),
        onPreJobOpStarted: setPreJobOperation,
        onClose: (ev) => {
          console.log("socket closed with event:", ev);
          setSocket(undefined);
        },
      });
      setSocket(ws);
    }
  }, [socket]);
  return (
    <SocketContext.Provider
      value={{
        states: {
          ...states,
          programResults,
          setProgramResults,
          preJobOperation,
        },
      }}
    >
      {children}
    </SocketContext.Provider>
  );
};
