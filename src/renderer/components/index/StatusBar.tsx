// import { useQuery } from "@tanstack/react-query";
import { Badge } from "@src/components/ui/badge";
// import { BackendStatus } from "@/types/status";
// import axios from "axios";
import { useState } from "react";
// import { useCaptainStateStore } from "@/stores/lifecycle";
import { useSocket } from "@src/hooks/useSocket";
import { IServerStatus } from "@src/context/socket.context";

const StatusBar = (): JSX.Element => {
  const [message, setMessage] = useState<string>("");
  const {
    states: { serverStatus },
  } = useSocket();

  // Listen for messages from the main process
  window.api.subscribeToElectronLogs((data) => {
    setMessage(data);
  });

  return (
    <div className="flex h-12 items-center gap-2 bg-background p-4">
      {![IServerStatus.OFFLINE, IServerStatus.CONNECTING].includes(
        serverStatus,
      ) ? (
        <Badge>Operational</Badge>
      ) : (
        <Badge variant={"destructive"}>Disconnected</Badge>
      )}
      <div className="text-sm">{message}</div>
    </div>
  );
};

export default StatusBar;
