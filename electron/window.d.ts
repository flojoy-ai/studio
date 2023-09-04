import api from "./api";

declare global {
  interface Window {
    api: typeof api;
  }
}
