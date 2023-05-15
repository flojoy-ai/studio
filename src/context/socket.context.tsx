import { ResultsType } from "@src/feature/results_panel/types/ResultsType";
import { SetStateAction } from "jotai";
import { createContext, Dispatch, useEffect, useRef, useState } from "react";
import { WebSocketServer } from "../web-socket/socket";
type States = {
  programResults: ResultsType | null;
  setProgramResults: Dispatch<SetStateAction<ResultsType>>;
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
  RQ_RUN_IN_PROCESS = "🏃‍♀️ running script...",
  RQ_RUN_COMPLETE = "🤙 python script run successful",
  MISSING_RQ_RESULTS = "👽 no result found",
  JOB_IN_RQ = "🎠 queuing python job= ",
  RQ_RESULTS_RETURNED = "🔔 new results - check LOGS",
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

const SOCKET_HOST = process.env.VITE_SOCKET_HOST || "127.0.0.1";
const BACKEND_PORT = +process.env.VITE_BACKEND_PORT! || 8000;

export const SocketContextProvider = ({ children }) => {
  const [socket, setSocket] = useState<WebSocketServer>();
  const [states, setStates] = useState(DEFAULT_STATES);
  const [programResults, setProgramResults] = useState<ResultsType>({ io: [] });
  const [preJobOperation, setPreJobOperation] = useState<
    States["preJobOperation"]
  >({
    isRunning: false,
    output: [],
  });
  const handleStateChange = (state: keyof States) => (value: any) => {
    setStates((prev) => ({
      ...prev,
      [state]: value,
    }));
  };

  useEffect(() => {
    console.log("4");
    if (!socket) {
      console.log("Creating new WebSocket connection to backend");
      const ws = new WebSocketServer({
        url: `ws://${SOCKET_HOST}:${BACKEND_PORT}/ws/socket-server/`,
        pingResponse: handleStateChange("serverStatus"),
        onNodeResultsReceived: setProgramResults,
        runningNode: handleStateChange("runningNode"),
        failedNode: handleStateChange("failedNode"),
        failureReason: handleStateChange("failureReason"),
        socketId: handleStateChange("socketId"),
        onPreJobOpStarted: setPreJobOperation,
        onClose: (ev) => {
          console.log("socket closed with event:", ev);
          setSocket(undefined);
        },
      });
      setSocket(ws);
    }
  });
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
      {" "}
      {children}
    </SocketContext.Provider>
  );
};
