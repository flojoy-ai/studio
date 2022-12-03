import { createContext, useEffect, useRef, useState } from "react";
import { WebSocketServer } from "../web-socket/socket";

export const SocketContext = createContext<any>(null);
const SOCKET_HOST = process.env.REACT_APP_SOCKET_HOST || 'localhost';

type States = {
  runningNode: string;
  serverStatus: string;
  failedNode: string;
  failureReason: any[];
  socketId: string;
};
const BACKEND_PORT= +process.env.REACT_APP_BACKEND_PORT! || 8000
export const SocketContextProvider = ({ children }) => {
  const socket = useRef<WebSocketServer>();
  const [states, setStates] = useState<States>({
    runningNode: "",
    serverStatus: "Connecting to server...",
    failedNode: '',
    failureReason: [],
    socketId: '',
  });
  const [programResults, setProgramResults] = useState<{io:any[]}>({io:[]});
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
        pingResponse: handleStateChange('serverStatus'),
        heartbeatResponse: setProgramResults,
        runningNode: handleStateChange('runningNode'),
        failedNode: handleStateChange('failedNode'),
        failureReason: handleStateChange('failureReason'),
        socketId: handleStateChange('socketId')
      });
    }
    return ()=> {
      socket.current?.disconnect()
    }
  }, []);
  return (
    <SocketContext.Provider
      value={{states: {...states, programResults, setProgramResults} }}
    >
      {children}
    </SocketContext.Provider>
  );
};
