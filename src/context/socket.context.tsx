import { ResultsType } from "@src/feature/results_panel/types/ResultsType";
import { SetStateAction } from "jotai";
import { createContext, Dispatch, useEffect, useRef, useState } from "react";
import { WebSocketServer } from "../web-socket/socket";
type States = {
  programResults: ResultsType | null;
  setProgramResults: Dispatch<SetStateAction<ResultsType>>;
  runningNode: string;
  serverStatus: string;
  failedNode: string;
  failureReason: string[];
  socketId: string;
};
const DEFAULT_STATES = {
  runningNode: "",
  serverStatus: "Connecting to server...",
  failedNode: "",
  failureReason: [],
  socketId: "",
};
export const SocketContext = createContext<{ states: States } | null>(null);

const SOCKET_HOST = process.env.REACT_APP_SOCKET_HOST || "localhost";
const BACKEND_PORT = +process.env.REACT_APP_BACKEND_PORT! || 8000;

export const SocketContextProvider = ({ children }) => {
  const socket = useRef<WebSocketServer>();
  const [states, setStates] = useState(DEFAULT_STATES);
  const [programResults, setProgramResults] = useState<ResultsType>({ io: [] });
  const handleStateChange = (state: keyof States) => (value: any) => {
    setStates((prev) => ({
      ...prev,
      [state]: value,
    }));
  };
  useEffect(() => {
    if (!socket.current) {
      socket.current = new WebSocketServer({
        url: `ws://${SOCKET_HOST}:${BACKEND_PORT}/ws/socket-server/`,
        pingResponse: handleStateChange("serverStatus"),
        heartbeatResponse: setProgramResults,
        runningNode: handleStateChange("runningNode"),
        failedNode: handleStateChange("failedNode"),
        failureReason: handleStateChange("failureReason"),
        socketId: handleStateChange("socketId"),
      });
    }
    return () => {
      socket.current?.disconnect();
    };
  }, []);
  return (
    <SocketContext.Provider
      value={{ states: { ...states, programResults, setProgramResults } }}
    >      {children}
    </SocketContext.Provider>
  );
};
