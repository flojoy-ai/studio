import { ResultsType } from "@src/feature/results_panel/types/ResultsType";
import { createContext, useEffect, useRef, useState } from "react";
import { WebSocketServer } from "../web-socket/socket";
type States = {
  programResults: ResultsType | null;
  runningNode: string;
  serverStatus: string;
  failedNodes: string[];
  failureReason: string[];
  socketId: string;
};
const DEFAULT_STATES = {
  programResults: null,
  runningNode: "",
  serverStatus: "Connecting to server...",
  failedNodes: [],
  failureReason: [],
  socketId: "",
};
export const SocketContext = createContext<{ states: States }>({
  states: DEFAULT_STATES,
});
const SOCKET_HOST = process.env.REACT_APP_SOCKET_HOST || "localhost";
const BACKEND_PORT = +process.env.REACT_APP_BACKEND_PORT! || 8000;

export const SocketContextProvider = ({ children }) => {
  const socket = useRef<WebSocketServer>();
  const [states, setStates] = useState<States>(DEFAULT_STATES);
  const handleStateChange = (state: keyof States) => (value: string) => {
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
        heartbeatResponse: handleStateChange("programResults"),
        runningNode: handleStateChange("runningNode"),
        failedNodes: handleStateChange("failedNodes"),
        failureReason: handleStateChange("failureReason"),
        socketId: handleStateChange("socketId"),
      });
    }
  }, []);
  return (
    <SocketContext.Provider value={{ states }}>
      {children}
    </SocketContext.Provider>
  );
};
