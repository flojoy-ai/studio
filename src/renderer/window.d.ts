import api from "../api/index";

declare global {
  interface Window {
    api: typeof api;
  }
}
