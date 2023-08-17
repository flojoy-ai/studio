import { IServerStatus } from "@src/context/socket.context";
import { NodeResult } from "@src/feature/common/types/ResultsType";
import { sendEventToMix } from "@src/services/MixpanelServices";

interface WebSocketServerProps {
  url: string;
  onPingResponse: (value: string | number | IServerStatus) => void;
  onNodeResultsReceived: React.Dispatch<React.SetStateAction<NodeResult[]>>;
  handleRunningNode: (value: string) => void;
  handleFailedNodes: (value: Record<string, string>) => void;
  handleSocketId: (value: string) => void;
  onPreJobOpStarted: React.Dispatch<
    React.SetStateAction<{
      isRunning: boolean;
      output: string[];
    }>
  >;
  onClose?: (ev: CloseEvent) => void;
}

enum ResponseEnum {
  systemStatus = "SYSTEM_STATUS",
  nodeResults = "NODE_RESULTS",
  runningNode = "RUNNING_NODE",
  failedNodes = "FAILED_NODES",
  preJobOperation = "PRE_JOB_OP",
}
export class WebSocketServer {
  private server: WebSocket;
  private handlePingResponse: WebSocketServerProps["onPingResponse"];
  private onNodeResultsReceived: WebSocketServerProps["onNodeResultsReceived"];
  private handleRunningNode: WebSocketServerProps["handleRunningNode"];
  private handleFailedNodes: WebSocketServerProps["handleFailedNodes"];
  private handleSocketId: WebSocketServerProps["handleSocketId"];
  private onPreJobOpStarted: WebSocketServerProps["onPreJobOpStarted"];
  private onClose?: (ev: CloseEvent) => void;
  constructor({
    url,
    onPingResponse,
    onNodeResultsReceived,
    handleRunningNode,
    handleFailedNodes,
    handleSocketId,
    onClose,
    onPreJobOpStarted,
  }: WebSocketServerProps) {
    this.handlePingResponse = onPingResponse;
    this.onNodeResultsReceived = onNodeResultsReceived;
    this.handleRunningNode = handleRunningNode;
    this.handleFailedNodes = handleFailedNodes;
    this.handleSocketId = handleSocketId;
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
            this.handlePingResponse(data[ResponseEnum.systemStatus]);
            if (
              data[ResponseEnum.systemStatus] === IServerStatus.RUN_COMPLETE
            ) {
              this.handlePingResponse(IServerStatus.STANDBY);
            }
            if (
              [IServerStatus.RUN_COMPLETE, IServerStatus.STANDBY].includes(
                data[ResponseEnum.systemStatus],
              )
            ) {
              this.onPreJobOpStarted({ isRunning: false, output: [] });
            }
          }
          if (ResponseEnum.nodeResults in data) {
            this.onNodeResultsReceived((prev) => {
              const resultIo = data[ResponseEnum.nodeResults];
              const isExist = prev.find((node) => node.id === resultIo.id);
              if (isExist) {
                const filterResult = prev.filter(
                  (node) => node.id !== resultIo.id,
                );
                return [...filterResult, resultIo];
              }
              return [...prev, resultIo];
            });
          }
          if (ResponseEnum.runningNode in data) {
            this.handleRunningNode(data[ResponseEnum.runningNode]);
          }
          if (ResponseEnum.failedNodes in data) {
            this.handleFailedNodes(data[ResponseEnum.failedNodes]);
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
          if (this.handleSocketId) {
            this.handleSocketId(data.socketId);
          }
          if (ResponseEnum.systemStatus in data) {
            this.handlePingResponse(data[ResponseEnum.systemStatus]);
          }
          sendEventToMix(
            "Initial Status",
            "Connection Established",
            "Server Status",
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
      this.handlePingResponse(IServerStatus.OFFLINE);
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
      }),
    );
  }
  isConnected() {
    return this.server.readyState;
  }
}
