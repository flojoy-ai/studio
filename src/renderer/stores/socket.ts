import { create } from "zustand";
import { BlockResult } from "@/renderer/routes/common/types/ResultsType";
import { ServerStatus, WorkerJobResponse } from "@/renderer/types/socket";

type State = {
  runningNode: string;
  blockResults: Record<string, BlockResult>;

  serverStatus: string;
  failedNodes: Record<string, string>;
  socketId: string;
  logs: string[];
};

type Actions = {
  setServerStatus: (val: string) => void;
  processWorkerResponse: (res: WorkerJobResponse) => void;
  wipeBlockResults: () => void;
  setSocketId: (val: string) => void;
};

// Immer breaks the blockResults setting for some reason??????????
export const useSocketStore = create<State & Actions>()((set) => ({
  serverStatus: ServerStatus.CONNECTING,
  setServerStatus: (val) => {
    set({ serverStatus: val });
  },

  processWorkerResponse: (res) => {
    if (res.SYSTEM_STATUS) {
      set({
        serverStatus:
          res.SYSTEM_STATUS === ServerStatus.RUN_COMPLETE
            ? ServerStatus.STANDBY
            : res.SYSTEM_STATUS,
      });
    }
    if (res.NODE_RESULTS) {
      set((state) => {
        const result = res.NODE_RESULTS!;
        return {
          ...state,
          blockResults: {
            ...state.blockResults,
            [result.id]: result,
          },
        };
      });
    }
    if (res.RUNNING_NODE) {
      set({ runningNode: res.RUNNING_NODE });
    }
    if (res.FAILED_NODES) {
      set({ failedNodes: res.FAILED_NODES });
    }
  },

  blockResults: {},
  wipeBlockResults: () => {
    set({ blockResults: {} });
  },

  runningNode: "",
  failedNodes: {},
  logs: [],

  socketId: "",
  setSocketId: (val) => {
    set({ socketId: val });
  },
}));
