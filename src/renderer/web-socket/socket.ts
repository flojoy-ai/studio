import { IServerStatus } from "@/renderer/context/socket.context";
import { NodeResult } from "@/renderer/routes/common/types/ResultsType";
import { sendEventToMix } from "@/renderer/services/MixpanelServices";

interface WebSocketServerProps {
  url: string;
  onPingResponse: (value: string | number | IServerStatus) => void;
  onNodeResultsReceived: React.Dispatch<React.SetStateAction<NodeResult[]>>;
  handleRunningNode: (value: string) => void;
  handleFailedNodes: (value: Record<string, string>) => void;
  handleSocketId: (value: string) => void;
  onClose?: (ev: CloseEvent) => void;
  onConnectionEstablished: () => void;
  onManifestUpdate: () => void;
  handleLogs: React.Dispatch<React.SetStateAction<string[]>>;
}

enum ResponseEnum {
  systemStatus = "SYSTEM_STATUS",
  nodeResults = "NODE_RESULTS",
  runningNode = "RUNNING_NODE",
  failedNodes = "FAILED_NODES",
  preJobOperation = "PRE_JOB_OP",
  log = "BACKEND_LOG",
}

export class WebSocketServer {
  private server: WebSocket;
  private handlePingResponse: WebSocketServerProps["onPingResponse"];
  private onNodeResultsReceived: WebSocketServerProps["onNodeResultsReceived"];
  private handleRunningNode: WebSocketServerProps["handleRunningNode"];
  private handleFailedNodes: WebSocketServerProps["handleFailedNodes"];
  private handleSocketId: WebSocketServerProps["handleSocketId"];
  private onClose?: (ev: CloseEvent) => void;
  private onConnectionEstablished: WebSocketServerProps["onConnectionEstablished"];
  private onManifestUpdate: WebSocketServerProps["onManifestUpdate"];
  private handleLogs: WebSocketServerProps["handleLogs"];
  constructor({
    url,
    onPingResponse,
    onNodeResultsReceived,
    handleRunningNode,
    handleFailedNodes,
    handleSocketId,
    onClose,
    onConnectionEstablished,
    onManifestUpdate,
    handleLogs,
  }: WebSocketServerProps) {
    this.handlePingResponse = onPingResponse;
    this.onNodeResultsReceived = onNodeResultsReceived;
    this.handleRunningNode = handleRunningNode;
    this.handleFailedNodes = handleFailedNodes;
    this.handleSocketId = handleSocketId;
    this.server = new WebSocket(url);
    this.onClose = onClose;
    this.onConnectionEstablished = onConnectionEstablished;
    this.onManifestUpdate = onManifestUpdate;
    this.handleLogs = handleLogs;
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
          if (ResponseEnum.log in data) {
            this.handleLogs((prev) => [...prev, data[ResponseEnum.log]]);
          }
          break;
        case "connection_established":
          if (this.handleSocketId) {
            this.handleSocketId(data.socketId);
          }
          if (ResponseEnum.systemStatus in data) {
            this.handlePingResponse(data[ResponseEnum.systemStatus]);
          }
          this.onConnectionEstablished();
          sendEventToMix("Initial Status", {
            "Server Status": "Connection Established",
          });
          break;
        case "manifest_update":
          this.onManifestUpdate();
          break;
        default:
          console.log(" default data type: ", data);
          break;
      }
    };
    this.server.onclose = this.onClose || null;
    this.server.onerror = (event) => {
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
