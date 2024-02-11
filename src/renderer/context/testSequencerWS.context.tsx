import { createContext } from "react";
import { SendJsonMessage } from "react-use-websocket/dist/lib/types";
import { TS_SOCKET_URL } from "@/renderer/data/constants";
import { filter } from "lodash";
import { useTestSequencerState } from "@/renderer/hooks/useTestSequencerState";
import { useEffect } from "react";
import useWebSocket, { ReadyState } from "react-use-websocket";
import { BackendMsg, MsgState, Test } from "@/renderer/types/testSequencer";
import { mapToTestResult } from "../routes/test_sequencer_panel/utils/TestUtils";
import { toast } from "sonner";

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
  const { websocketId, setRunning, setElems, setIsLocked, setIsLoading } =
    useTestSequencerState();
  const { sendJsonMessage, lastJsonMessage, readyState } = useWebSocket(
    `${TS_SOCKET_URL}/${websocketId}`,
    {
      shouldReconnect: () => true,
      reconnectInterval: 2000,
      share: true,
    },
  );

  //set result when received from backend for specific test
  const setResult = (id: string, result: boolean, timeTaken: number) => {
    setElems.withException((elems) => {
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
      setIsLoading(false);
      sendJsonMessage({
        event: "subscribe",
        data: "hello world",
      });
    } else {
      setIsLoading(true);
    }
  }, [readyState]);

  const mapToHandler: { [K in MsgState]: (data: BackendMsg) => void } = {
    TEST_SET_START: (data) => {
      console.log("starting tests", data);
    },
    TEST_DONE: (data) => {
      setRunning((run) => filter(run, (r) => r !== data.target_id));
      setResult(data.target_id, data.result, data.time_taken);
    },
    RUNNING: (data) => {
      setRunning([data.target_id]);
    },
    ERROR: (data) => {
      toast.error(
        <div>
          <p className="text-red-500">ERROR</p>
          {data.error}
        </div>,
      );
      console.error(data.error);
      setIsLocked(false);
    },
    TEST_SET_DONE: (data) => {
      console.log("tests are done", data);
      setIsLocked(false);
    },
  };

  // Run when a new WebSocket message is received (lastJsonMessage)
  useEffect(() => {
    const data = lastJsonMessage as BackendMsg;
    if (data === null) return;
    mapToHandler[data.state](data);
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
