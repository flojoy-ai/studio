import { create } from "zustand";
import { BlockResult } from "@/renderer/types/block-result";
import {
  ServerStatus,
  ServerStatusEnum,
  WorkerJobResponse,
} from "@/renderer/types/socket";

type State = {
  runningBlock: string;
  blockResults: Record<string, BlockResult>;

  serverStatus: ServerStatusEnum;
  failedBlocks: Record<string, string>;
  socketId: string;
};

type Actions = {
  setServerStatus: (val: ServerStatusEnum) => void;
  processWorkerResponse: (res: WorkerJobResponse) => void;
  wipeBlockResults: () => void;
  setSocketId: (val: string) => void;
};

// Don't change this to use Immer,
// it breaks the blockResults setting for some reason??????????
export const useSocketStore = create<State & Actions>()((set) => ({
  serverStatus: ServerStatus.CONNECTING,
  setServerStatus: (val) => {
    set({ serverStatus: val });
  },

  processWorkerResponse: (res) => {
    if (res.SYSTEM_STATUS) {
      set({
        serverStatus: res.SYSTEM_STATUS,
      });
    }
    if (res.NODE_RESULTS) {
      set((state) => {
        const result = res.NODE_RESULTS!;
        return {
          ...state,
          blockResults: {
            ...state.blockResults,
            [result.id]: result.result,
          },
        };
      });
    }
    if (res.RUNNING_NODE) {
      set({ runningBlock: res.RUNNING_NODE });
    }
    if (res.FAILED_NODES) {
      set({ failedBlocks: res.FAILED_NODES });
    }
  },

  blockResults: {},
  wipeBlockResults: () => {
    set({ blockResults: {} });
  },

  runningBlock: "",
  failedBlocks: {},

  socketId: "",
  setSocketId: (val) => {
    set({ socketId: val });
  },
}));
