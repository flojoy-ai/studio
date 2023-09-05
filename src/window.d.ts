import api from "../electron/api";

declare global {
  interface Window {
    api: typeof api & {
      isPackaged: boolean;
    };
  }
}
