import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import { BlockResult } from "@/renderer/routes/common/types/ResultsType";
import { ServerStatus } from "@/renderer/types/socket";

type State = {
  runningNode: string;
  blockResults: BlockResult[];

  serverStatus: ServerStatus;
  failedNodes: Record<string, string>;
  socketId: string;
  logs: string[];
};

type Actions = {
  setServerStatus: (val: ServerStatus) => void;

  addBlockResult: (val: BlockResult) => void;
  wipeBlockResults: () => void;

  setRunningNode: (val: string) => void;
  setFailedNodes: (val: Record<string, string>) => void;

  appendLog: (val: string) => void;

  setSocketId: (val: string) => void;
};

export const useSocketStore = create<State & Actions>()(
  immer((set) => ({
    serverStatus: ServerStatus.CONNECTING,
    setServerStatus: (val) => {
      set((state) => {
        state.serverStatus = val;
      });
    },

    blockResults: [],
    addBlockResult: (val) => {
      set((state) => {
        const blockExistInResult = state.blockResults.find(
          (block) => block.id === val.id,
        );

        if (blockExistInResult) {
          state.blockResults = state.blockResults.map((block) => {
            if (block.id === val.id) {
              return val;
            }
            return block;
          });
        }
        return state.blockResults.push(val);
      });
    },
    wipeBlockResults: () => {
      set({ blockResults: [] });
    },

    runningNode: "",
    setRunningNode: (val) => {
      set({ runningNode: val });
    },

    failedNodes: {},
    setFailedNodes: (val) => {
      set({ failedNodes: val });
    },

    logs: [],
    appendLog: (val) => {
      set((state) => {
        state.logs.push(val);
      });
    },

    socketId: "",
    setSocketId: (val) => {
      set({ socketId: val });
    },
  })),
);
