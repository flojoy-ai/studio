import { createContext, useContext } from "react";
import { SendJsonMessage } from "react-use-websocket/dist/lib/types";
import { useTestSequencerState } from "@/renderer/hooks/useTestSequencerState";
import { useEffect } from "react";
import useWebSocket, { ReadyState } from "react-use-websocket";
import { BackendMsg, Test } from "@/renderer/types/test-sequencer";
import { mapToTestResult } from "@/renderer/routes/test_sequencer_panel/utils/TestUtils";
import { toast } from "sonner";
import { env } from "@/env";

type ContextType = {
  tSSendJsonMessage: SendJsonMessage;
};

export const TSWebSocketContext = createContext<ContextType>({
  tSSendJsonMessage: () => null,
});

export function TestSequencerWSProvider({
  children,
}: {
  children?: React.ReactNode;
}) {
  const {
    websocketId,
    markTestAsDone,
    addTestToRunning,
    setElems,
    setIsLocked,
    setIsLoading,
    setBackendState,
  } = useTestSequencerState();

  const { sendJsonMessage, lastJsonMessage, readyState } = useWebSocket(
    `ws://${env.VITE_BACKEND_HOST}:${env.VITE_BACKEND_PORT}/ts-ws/${websocketId}`,
    {
      shouldReconnect: () => true,
      reconnectInterval: 2000,
      share: true,
    },
  );

  // Set result when received from backend for specific test
  const setResult = (
    id: string,
    result: boolean,
    timeTaken: number,
    isSavedToCloud: boolean,
    error: string | null,
  ) => {
    setElems.withException((elems) => {
      const newElems = [...elems];
      const idx = newElems.findIndex((elem) => elem.id === id);
      newElems[idx] = {
        ...newElems[idx],
        status: mapToTestResult(result),
        completionTime: timeTaken,
        isSavedToCloud: isSavedToCloud,
        error: error,
      } as Test;
      return newElems;
    });
  };

  // Run when the connection state (readyState) changes
  useEffect(() => {
    console.log("Connection state changed: ", readyState);
    if (readyState === ReadyState.OPEN) {
      setIsLoading(false);
      sendJsonMessage({
        event: "subscribe",
        data: "hello world",
        hardware_id: null,
        project_id: null,
      });
    } else {
      setIsLoading(true);
    }
  }, [readyState, sendJsonMessage, setIsLoading]);

  // Run when a new WebSocket message is received (lastJsonMessage)
  useEffect(() => {
    if (!lastJsonMessage) return;

    const msg = BackendMsg.safeParse(lastJsonMessage);
    if (!msg.success) {
      console.error(msg.error);
      return;
    }

    switch (msg.data.state) {
      case "test_set_start":
        setBackendState("test_set_start");
        break;
      case "test_set_export":
        setBackendState("test_set_export");
        break;
      case "test_done":
        markTestAsDone(msg.data.target_id);
        setResult(
          msg.data.target_id,
          msg.data.result,
          msg.data.time_taken,
          msg.data.is_saved_to_cloud,
          msg.data.error,
        );
        // Don't specify a backend state here, because we want to keep the "RUNNER" or "EXPORT" state
        break;
      case "running":
        addTestToRunning(msg.data.target_id);
        // Don't specify a backend state here, because we want to keep the "RUNNER" or "EXPORT" state
        break;
      case "error":
        toast.error(
          <div>
            <p className="text-red-500">ERROR</p>
            {msg.data.error}
          </div>,
        );
        console.error(msg.data.error);
        setIsLocked(false);
        setBackendState("error");
        break;
      case "test_set_done":
        console.log("tests are done", msg.data);
        setIsLocked(false);
        setBackendState("test_set_done");
        break;
      default:
        break;
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
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

export const useTestSequencerWS = () => useContext(TSWebSocketContext);
