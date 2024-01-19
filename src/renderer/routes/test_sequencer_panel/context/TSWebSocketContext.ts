import { createContext } from "react";
import { SendJsonMessage } from "react-use-websocket/dist/lib/types";

type ContextType = {
  tSSendJsonMessage: SendJsonMessage;
};

const TSWebSocketContext = createContext<ContextType>({
  tSSendJsonMessage: () => null,
});

export default TSWebSocketContext;
