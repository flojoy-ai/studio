import { useContext } from "react";
import { SocketContext } from "@/renderer/context/socket.context";

export const useSocket = () => {
  const data = useContext(SocketContext);
  if (!data) {
    throw new Error("useSocket must be used within a SocketProvider");
  }
  return { ...data };
};
