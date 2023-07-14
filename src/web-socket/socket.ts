import { IServerStatus } from "@src/context/socket.context";
import { sendEventToMix } from "@src/services/MixpanelServices";

interface WebSocketServerProps {
  url: string;
  pingResponse: any;
  onNodeResultsReceived: any;
  runningNode: any;
  failedNode: any;
  failureReason: any;
  socketId: any;
  onPreJobOpStarted: any;
  onClose?: (ev: CloseEvent) => void;
}

enum ResponseEnum {
  systemStatus = "SYSTEM_STATUS",
  nodeResults = "NODE_RESULTS",
  runningNode = "RUNNING_NODE",
  failedNodes = "FAILED_NODES",
  failureReason = "FAILURE_REASON",
  preJobOperation = "PRE_JOB_OP",
}
export class WebSocketServer {
  private server: WebSocket;
  private pingResponse: any;
  private onNodeResultsReceived: any;
  private runningNode: any;
  private failedNode: any;
  private failureReason: any;
  private socketId: any;
  private onPreJobOpStarted: any;
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
    onPreJobOpStarted,
  }: WebSocketServerProps) {
    this.pingResponse = pingResponse;
    this.onNodeResultsReceived = onNodeResultsReceived;
    this.runningNode = runningNode;
    this.failedNode = failedNode;
    this.failureReason = failureReason;
    this.socketId = socketId;
    this.server = new WebSocket(url);
    this.onClose = onClose;
    this.onPreJobOpStarted = onPreJobOpStarted;
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
              data[ResponseEnum.systemStatus] === IServerStatus.RUN_COMPLETE
            ) {
              this.pingResponse(IServerStatus.STANDBY);
            }
            if (
              [IServerStatus.RUN_COMPLETE, IServerStatus.STANDBY].includes(
                data[ResponseEnum.systemStatus]
              )
            ) {
              this.onPreJobOpStarted({ isRunning: false, output: [] });
            }
          }
          if (ResponseEnum.nodeResults in data) {
            this.onNodeResultsReceived((prev: any) => {
              const isExist = prev.io.find(
                (node) => node.id === data[ResponseEnum.nodeResults].id
              );
              const resultIo = data[ResponseEnum.nodeResults];
              const resultData = {
                ...resultIo,
                result: {
                  ...resultIo.result,
                  type:
                    resultIo.result.type === "file"
                      ? "image"
                      : resultIo.result.type,
                },
              };
              if (isExist) {
                const filterResult = prev.io.filter(
                  (node) => node.id !== resultIo.id
                );
                return {
                  io: [...filterResult, resultData],
                };
              }

              return {
                io: [...prev.io, resultData],
              };
            });
          }
          if (ResponseEnum.runningNode in data) {
            this.runningNode(data[ResponseEnum.runningNode]);
          }
          if (ResponseEnum.failedNodes in data) {
            this.failedNode(data[ResponseEnum.failedNodes]);
            if (ResponseEnum.failureReason in data) {
              this.failureReason(data[ResponseEnum.failureReason]);
            }
          }
          if (ResponseEnum.preJobOperation in data) {
            this.onPreJobOpStarted((prev) => ({
              isRunning: data[ResponseEnum.preJobOperation].isRunning,
              output: data[ResponseEnum.preJobOperation].isRunning
                ? [...prev.output, data[ResponseEnum.preJobOperation].output]
                : [],
            }));
          }
          break;
        case "connection_established":
          if (this.socketId) {
            this.socketId(data.socketId);
          }
          if (ResponseEnum.systemStatus in data) {
            this.pingResponse(data[ResponseEnum.systemStatus]);
          }
          sendEventToMix(
            "Initial Status",
            "Connection Established",
            "Server Status"
          );
          break;
        default:
          console.log(" default data type: ", data);
          break;
      }
    };
    this.server.onclose = this.onClose || null;
    this.server.onerror = (event) => {
      sendEventToMix("Inital Status", "Connection Failed", "Server Status");
      console.log("Error Event: ", event);
      this.pingResponse(IServerStatus.OFFLINE);
    };
  }
  disconnect() {
    console.log("Disconnecting WebSocket server");
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
