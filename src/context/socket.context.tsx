import { createContext, useEffect, useRef, useState } from "react";
import STATUS_CODES from "../STATUS_CODES.json";
import { WebSocketServer } from "../web-socket/socket";

export const SocketContext = createContext<any>(null);

export const SocketContextProvider = ({ children }) => {
  const socket = useRef<WebSocketServer>();
  const [programResults, setProgramResults] = useState({
    msg: STATUS_CODES.NO_RUNS_YET,
  });
  const [serverStatus, setServerStatus] = useState("Connecting to server...");

  useEffect(() => {
    if (!socket.current) {
      socket.current = new WebSocketServer(
        "ws://localhost:8000/ws/socket-server/",
        setServerStatus,
        setProgramResults
      );
    }
  }, []);
  return (
    <SocketContext.Provider value={{ serverStatus, programResults }}>
      {children}
    </SocketContext.Provider>
  );
};
