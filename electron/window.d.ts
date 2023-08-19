import type { ContextBridgeApi } from "./preload";

declare global {
  interface Window {
    api: ContextBridgeApi;
  }
}
