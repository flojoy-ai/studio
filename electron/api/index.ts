import { ipcRenderer } from "electron";
import * as fileSave from "./fileSave";

export type CallBackArgs =
  | {
      open: boolean;
      title?: string;
      description?: string;
      output: string;
      clear?:boolean;
    }
  | string;

export default {
  ...fileSave,
  setUnsavedChanges: (value: boolean) =>
    ipcRenderer.send("set-unsaved-changes", value),
  send: (channel: string, data: string) => {
    // whitelist channels
    const validChannels = ["backend", "ping"];
    if (validChannels.includes(channel)) {
      ipcRenderer.send(channel, data);
    }
  },
  receive: (channel: string, func: (arg: CallBackArgs) => void) => {
    const validChannels = ["backend", "ping"];
    if (validChannels.includes(channel)) {
      // Deliberately strip event as it includes `sender`
      ipcRenderer.on(channel, (event, args: CallBackArgs) => func(args));
    }
  },
};
