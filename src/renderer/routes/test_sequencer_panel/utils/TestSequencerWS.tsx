import { TS_SOCKET_URL } from "@src/data/constants";
import { useTestSequencerState } from "@src/hooks/useTestSequencerState";
import { useEffect } from "react";
import useWebSocket, { ReadyState } from "react-use-websocket";
import TSWebSocketContext from "../context/TSWebSocketContext";

function TestSequencerWS({ children }: { children: React.ReactNode }) {
  const { websocketId } = useTestSequencerState();
  const { sendJsonMessage, lastJsonMessage, readyState } = useWebSocket(
    `${TS_SOCKET_URL}/${websocketId}`,
    {
      share: true,
    },
  );

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
    console.log(`Got a new message: ${lastJsonMessage}`);
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
