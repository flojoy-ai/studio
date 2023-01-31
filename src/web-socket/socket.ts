interface WebSocketServerProps {
  url: string;
  pingResponse: any;
  onNodeResultsReceived: any;
  runningNode: any;
  failedNode: any;
  failureReason: any;
  socketId: any;
  onClose?: (ev: CloseEvent) => void;
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
  private onNodeResultsReceived: any;
  private runningNode: any;
  private failedNode: any;
  private failureReason: any;
  private socketId: any;
  private onClose?: (ev: CloseEvent) => void;
  constructor({
    url,
    pingResponse,
    onNodeResultsReceived,
    runningNode,
    failedNode,
    failureReason,
    socketId,
    onClose,
  }: WebSocketServerProps) {
    this.pingResponse = pingResponse;
    this.onNodeResultsReceived = onNodeResultsReceived;
    this.runningNode = runningNode;
    this.failedNode = failedNode;
    this.failureReason = failureReason;
    this.socketId = socketId;
    this.server = new WebSocket(url);
    this.onClose = onClose;
    this.init();
  }
  init() {
    this.server.onmessage = (ev) => {
      const data = JSON.parse(ev.data);
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
            this.onNodeResultsReceived((prev: any) => {
              const isExist = prev.io.find((node)=> node.id === data[ResponseEnum.nodeResults].id)
              if(isExist){
                const filterResult = prev.io.filter(node => node.id !== data[ResponseEnum.nodeResults].id)
                return {
                  io: [...filterResult, data[ResponseEnum.nodeResults]],
                }
              }

              return {
                io: [...prev.io, data[ResponseEnum.nodeResults]],
              }
            }
            );
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
    this.server.onclose = this.onClose || null;
  }
  disconnect() {
    console.log('Disconnecting WebSocket server');
    this.server.close();
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
