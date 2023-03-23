import { ResultsType } from "@src/feature/results_panel/types/ResultsType";
import { SetStateAction } from "jotai";
import { createContext, Dispatch, useEffect, useState } from "react";
import { WebSocketServer } from "../web-socket/socket";
import serverStatusObj from "@src/STATUS_CODES.json"


type States = {
  programResults: ResultsType | null;
  setProgramResults: Dispatch<SetStateAction<ResultsType>>;
  runningNode: string;
  serverStatus: string;
  failedNode: string;
  failureReason: string[];
  socketId: string;
};
export const IServerStatus = serverStatusObj;
const DEFAULT_STATES = {
  runningNode: "",
  serverStatus: IServerStatus.CONNECTING,
  failedNode: "",
  failureReason: [],
  socketId: "",
};
export const SocketContext = createContext<{ states: States } | null>(null);

const SOCKET_HOST = process.env.REACT_APP_SOCKET_HOST || "localhost";
const BACKEND_PORT = +process.env.REACT_APP_BACKEND_PORT! || 8000;

export const SocketContextProvider = ({ children }) => {
  const [socket, setSocket] = useState<WebSocketServer>();
  const [states, setStates] = useState(DEFAULT_STATES);
  const [programResults, setProgramResults] = useState<ResultsType>({ io: [] });
  const handleStateChange = (state: keyof States) => (value: any) => {
    setStates((prev) => ({
      ...prev,
      [state]: value,
    }));
  };

  useEffect(() => {
    if (!socket) { 
      console.log('Creating new WebSocket connection to backend')
      const ws = new WebSocketServer({
        url: `ws://${SOCKET_HOST}:${BACKEND_PORT}/ws/socket-server/`,
        pingResponse: handleStateChange("serverStatus"),
        onNodeResultsReceived: setProgramResults,
        runningNode: handleStateChange("runningNode"),
        failedNode: handleStateChange("failedNode"),
        failureReason: handleStateChange("failureReason"),
        socketId: handleStateChange("socketId"),
        onClose: (ev) => {
          console.log('socket closed with event:', ev);
          setSocket(undefined);
        }
      });
      setSocket(ws);
    }
  }, [socket]);
  return (
    <SocketContext.Provider
      value={{ states: { ...states, programResults, setProgramResults } }}
    >      {children}
    </SocketContext.Provider>
  );
};
