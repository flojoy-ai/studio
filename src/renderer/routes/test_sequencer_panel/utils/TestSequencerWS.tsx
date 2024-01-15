import { useTestSequencerState } from "@src/hooks/useTestSequencerState";
import React, { useEffect } from "react";
import { TS_SOCKET_URL } from "@src/data/constants";
import useWebSocket, { ReadyState } from "react-use-websocket";

function TestSequencerWS() {
  const { websocketId } = useTestSequencerState();
  const { sendJsonMessage, lastJsonMessage, readyState } = useWebSocket(
    `${TS_SOCKET_URL}/${websocketId}`,
    {
      share: false,
      shouldReconnect: () => true,
    },
  );

  // Run when the connection state (readyState) changes
  useEffect(() => {
    console.log("Connection state changed");
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

  return <></>;
}

export default TestSequencerWS;
