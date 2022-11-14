import { useContext } from "react"
import { SocketContext } from "../context/socket.context"

export const useSocket=()=>{
    const data = useContext(SocketContext);
    return {...data}
}