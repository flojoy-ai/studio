interface WebSocketServerProps {
  url: string;
  pingResponse: any;
  heartbeatResponse: any;
  runningNode: any;
  failedNode: any;
  failureReason: any;
  socketId: any;
}

enum ResponseEnum {
  systemStatus = "SYSTEM_STATUS",
  nodeResults = "NODE_RESULTS",
  runningNode = "RUNNING_NODE",
  failedNodes = "FAILED_NODES",
}
export class WebSocketServer {
  private server: WebSocket;
  private pingResponse: any;
  private heartbeatResponse: any;
  private runningNode: any;
  private failedNode: any;
  private failureReason: any;
  private socketId: any;
  constructor({
    url,
    pingResponse,
    heartbeatResponse,
    runningNode,
    failedNode,
    failureReason,
    socketId,
  }: WebSocketServerProps) {
    this.pingResponse = pingResponse;
    this.heartbeatResponse = heartbeatResponse;
    this.runningNode = runningNode;
    this.failedNode = failedNode;
    this.failureReason = failureReason;
    this.socketId = socketId;
    this.server = new WebSocket(url);
    this.init();
  }
  init() {
    this.server.onmessage = (ev) => {
      let data = JSON.parse(ev.data);
      // console.log("data received: ", data.type === "heartbeat_response");
      switch (data.type) {
        case "worker_response":
          if (ResponseEnum.systemStatus in data) {
            this.pingResponse(data[ResponseEnum.systemStatus]);
            if (
              data[ResponseEnum.systemStatus] ===
              "🤙 python script run successful"
            ) {
              this.pingResponse("🐢 awaiting a new job");
            }
          }
          if (ResponseEnum.nodeResults in data) {
            this.heartbeatResponse((prev: any) => ({
              io: [...prev.io, data[ResponseEnum.nodeResults]],
            }));
          }
          if (ResponseEnum.runningNode in data) {
            this.runningNode(data[ResponseEnum.runningNode]);
          }
          if (ResponseEnum.failedNodes in data) {
            this.failedNode(data[ResponseEnum.failedNodes]);
          }
          break;
        case "connection_established":
          if (this.socketId) {
            this.socketId(data.socketId);
          }
          if (ResponseEnum.systemStatus in data) {
            this.pingResponse(data[ResponseEnum.systemStatus]);
          }
          break;

        default:
          console.log(" default data type: ", data);
          break;
      }
    };
  }
  disconnect() {
    this.server.close(0);
  }
  emit(data: string) {
    this.server.send(
      JSON.stringify({
        type: data,
      })
    );
  }
  isConnected() {
    return this.server.readyState;
  }
}
