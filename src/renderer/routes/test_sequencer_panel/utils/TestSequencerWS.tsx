import { TS_SOCKET_URL } from "@src/data/constants";
import { filter } from "lodash";
import { useTestSequencerState } from "@src/hooks/useTestSequencerState";
import { useEffect } from "react";
import useWebSocket, { ReadyState } from "react-use-websocket";
import TSWebSocketContext from "../context/TSWebSocketContext";
import { mapToTestResult } from "./TestUtils";
import { BackendMsg, Test } from "@src/types/testSequencer";

function TestSequencerWS({ children }: { children: React.ReactNode }) {
  const { websocketId, setRunning, setElems } = useTestSequencerState();
  const { sendJsonMessage, lastJsonMessage, readyState } = useWebSocket(
    `${TS_SOCKET_URL}/${websocketId}`,
    {
      share: true,
    },
  );

  //set result when received from backend for specific test
  const setResult = (id: string, result: boolean, timeTaken: number) => {
    setElems((elems) => {
      const new_elems = [...elems];
      const idx = new_elems.findIndex((elem) => elem.id === id);
      new_elems[idx] = {
        ...new_elems[idx],
        status: mapToTestResult(result),
        completionTime: timeTaken,
      } as Test;
      return new_elems;
    });
  };

  // Run when the connection state (readyState) changes
  useEffect(() => {
    console.log("Connection state changed: ", readyState);
    if (readyState === ReadyState.OPEN) {
      sendJsonMessage({
        event: "subscribe",
        data: {
          message: "Hello world",
        },
      });
    }
  }, [readyState]);

  // Run when a new WebSocket message is received (lastJsonMessage)
  useEffect(() => {
    const data = lastJsonMessage as BackendMsg;
    console.log(data);
    if (data === null) return;
    switch (data.state) {
      case "RUNNING":
        console.log("target id is:", data.target_id);
        setRunning([data.target_id]);
        break;
      case "TEST_DONE":
        setRunning((run) => filter(run, (r) => r !== data.target_id));
        setResult(data.target_id, data.result, data.time_taken);
        break;
    }
  }, [lastJsonMessage]);

  return (
    <TSWebSocketContext.Provider
      value={{
        tSSendJsonMessage: sendJsonMessage,
      }}
    >
      {children}
    </TSWebSocketContext.Provider>
  );
}

export default TestSequencerWS;
