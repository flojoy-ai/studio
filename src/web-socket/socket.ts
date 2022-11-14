export class WebSocketServer {
  private server: WebSocket;
  private pingResponse: any;
  private heartbeatResponse: any;
  constructor(url: string, pingResponse: any, heartbeatResponse: any) {
    this.pingResponse = pingResponse;
    this.heartbeatResponse = heartbeatResponse;
    this.server = new WebSocket(url);
    this.init();
  }
  init() {
    console.log(" socket readystate: ", this.server.readyState);
    this.server.onmessage = (ev) => {
      let data = JSON.parse(ev.data);
      // console.log("data received: ", data.type === "heartbeat_response");
      switch (data.type) {
        case "heartbeat_response":
          if (this.heartbeatResponse) {
            if (this.pingResponse) {
              this.pingResponse(data.msg);
            }
            this.heartbeatResponse(data);
          }
          break;
        case "ping_response":
          if (this.pingResponse) {
            this.pingResponse(data.msg);
          }
          break;
        case "connection_established":
          this.server.send(
            JSON.stringify({
              type: "ping",
            })
          );
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
