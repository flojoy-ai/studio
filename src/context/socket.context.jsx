import { createContext, useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";
import STATUS_CODES from "../STATUS_CODES.json";

export const SocketContext = createContext(null);

export const SocketContextProvider = ({ children }) => {
  const socket = useRef(null);
  const [programResults, setProgramResults] = useState({
    msg: STATUS_CODES.NO_RUNS_YET,
  });
  const [serverStatus, setServerStatus] = useState("Connecting to server...");

  useEffect(() => {
    if (!socket.current) {
      socket.current = io("http://localhost:5000");
    }

    return () => {
      if (socket.current) {
        socket.current.disconnect();
      }
    };
  }, []);

  useEffect(() => {
    if (socket.current) {
      socket.current.emit("ping");
    }
  }, []);

  useEffect(() => {
    if (socket.current) {
      socket.current.on("ping", (data) => {
        if ("msg" in data) {
          setServerStatus(data.msg);
          // set a timer that gets an update from the server every secon
        } else {
          setServerStatus(STATUS_CODES["SERVER_OFFLINE"]);
        }
      });
      socket.current.on("program-results", (res) => {
        if (res.msg === STATUS_CODES["MISSING_RQ_RESULTS"]) {
          setServerStatus(res.msg);
        } else {
          setServerStatus(STATUS_CODES["RQ_RESULTS_RETURNED"]);
          setProgramResults(res);
        }
      });
      socket.current.on("system-status", (res) => {
        if (res.msg === STATUS_CODES["RQ_RUN_COMPLETE"]) {
          // grab program result from redis
          setServerStatus(STATUS_CODES["RQ_RUN_COMPLETE"]);
        } else if (res.msg !== undefined && res.msg !== "") {
          // Program in process, awaiting a new job etc...
          setServerStatus(res.msg);
        }
      });
    }
  });

  return (
    <SocketContext.Provider value={{ serverStatus, programResults }}>
      {children}
    </SocketContext.Provider>
  );
};
