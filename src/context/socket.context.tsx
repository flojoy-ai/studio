import { createContext, useEffect, useRef, useState } from "react";
import { WebSocketServer } from "../web-socket/socket";

export const SocketContext = createContext<any>(null);
const SOCKET_HOST = process.env.REACT_APP_SOCKET_HOST || 'localhost';
const BACKEND_PORT= +process.env.REACT_APP_BACKEND_PORT! || 8000

type States = {
  programResults: any;
  runningNode: string;
  serverStatus: string;
  failedNodes: any[];
  failureReason: any[];
  socketId: string;
};
export const SocketContextProvider = ({ children }) => {
  const socket = useRef<WebSocketServer>();
  const [states, setStates] = useState<States>({
    programResults: {},
    runningNode: "",
    serverStatus: "Connecting to server...",
    failedNodes: [],
    failureReason: [],
    socketId: '',
  });
  const handleStateChange = (state: keyof States) => (value: any) => {
    setStates((prev) => ({
      ...prev,
      [state]: value,
    }));
  };
  useEffect(() => {
    if (!socket.current) {
      console.log(' BACKEND_PORT:', process.env.REACT_APP_BACKEND_PORT)
      socket.current = new WebSocketServer({
        url: `ws://${SOCKET_HOST}:${BACKEND_PORT}/ws/socket-server/`,
        pingResponse: handleStateChange('serverStatus'),
        heartbeatResponse: handleStateChange('programResults'),
        runningNode: handleStateChange('runningNode'),
        failedNodes: handleStateChange('failedNodes'),
        failureReason: handleStateChange('failureReason'),
        socketId: handleStateChange('socketId')
      });
    }
  }, []);
  return (
    <SocketContext.Provider
      value={{ states }}
    >
      {children}
    </SocketContext.Provider>
  );
};
