import { createContext, useContext } from "react";
import { SendJsonMessage } from "react-use-websocket/dist/lib/types";
import { useSequencerState, useSequencerTestState } from "@/renderer/hooks/useTestSequencerState";
import { useEffect } from "react";
import useWebSocket, { ReadyState } from "react-use-websocket";
import { BackendMsg, Test } from "@/renderer/types/test-sequencer";
import { toast } from "sonner";
import { env } from "@/env";
import { useSequencerStore } from "../stores/sequencer";

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
    elems,
    setElems,
    setIsLocked,
    setBackendGlobalState,
    setBackendState,
  } = useSequencerTestState();
  const {
    handleUpload,
    runNextRunnableSequence,
  } = useSequencerState();
  const { saveCycle, websocketId, setIsLoading, updateSequenceStatus } =
    useSequencerStore((state) => ({
      saveCycle: state.saveCycle,
      websocketId: state.websocketId,
      setIsLoading: state.setIsLoading,
      updateSequenceStatus: state.updateSequenceStatus,
    }));

  const { sendJsonMessage, lastJsonMessage, readyState } = useWebSocket(
    `ws://${env.VITE_BACKEND_HOST}:${env.VITE_BACKEND_PORT}/ts-ws/${websocketId}`,
    {
      shouldReconnect: () => true,
      reconnectInterval: 2000,
      share: true,
    },
  );

  const updateTestStatus = (id: string, status: string) => {
    setElems.withException((elems) => {
      const newElems = [...elems];
      const idx = newElems.findIndex((elem) => elem.id === id);
      newElems[idx] = {
        ...newElems[idx],
        status: status,
      } as Test;
      return newElems;
    });
  };

  // Set result when received from backend for specific test
  const setResult = (
    id: string,
    result: string,
    timeTaken: number,
    createdAt: string,
    isSavedToCloud: boolean,
    error: string | null,
  ) => {
    setElems.withException((elems) => {
      const newElems = [...elems];
      const idx = newElems.findIndex((elem) => elem.id === id);
      newElems[idx] = {
        ...newElems[idx],
        status: result,
        completionTime: timeTaken,
        createdAt: createdAt,
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
    } else {
      console.log("Received message from backend: ", msg.data);
    }

    switch (msg.data.state) {
      // Global state ----------------------
      case "test_set_start":
        setBackendGlobalState(msg.data.state);
        setBackendState(msg.data.state);
        break;
      case "test_set_export":
        setBackendGlobalState(msg.data.state);
        setBackendState(msg.data.state);
        break;
      case "test_set_done":
        setBackendGlobalState(msg.data.state);
        setBackendState(msg.data.state);
        setIsLocked(false);
        // eslint-disable-next-line no-case-declarations
        const failed = elems.some((elem) => {
          if (elem.type === "test") {
            return elem.status === "fail";
          }
          return false;
        });
        updateSequenceStatus(failed ? "fail" : "pass");
        runNextRunnableSequence(sendJsonMessage);
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
        setBackendGlobalState(msg.data.state);
        setBackendState(msg.data.state);
        updateSequenceStatus(msg.data.status);
        saveCycle();
        handleUpload(true);
        break;
      // Test state -------------------------
      case "test_done":
        setResult(
          msg.data.target_id,
          msg.data.status,
          msg.data.time_taken,
          msg.data.created_at,
          msg.data.is_saved_to_cloud,
          msg.data.error,
        );
        setBackendState(msg.data.state);
        break;
      case "running":
        updateTestStatus(msg.data.target_id, msg.data.state);
        updateSequenceStatus(msg.data.state);
        setBackendState(msg.data.state);
        break;
      case "paused":
        updateTestStatus(msg.data.target_id, msg.data.state);
        updateSequenceStatus(msg.data.state);
        setBackendState(msg.data.state);

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
