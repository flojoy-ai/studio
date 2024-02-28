import { v4 as uuidv4 } from "uuid";

import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import {
  Conditional,
  MsgState,
  Test,
  TestRootNode,
} from "../types/testSequencer";

type State = {
  curRun: string[];
  websocketId: string;
  elements: (Test | Conditional)[];
  isLocked: boolean;
  isLoading: boolean;
  backendState: MsgState;
  testSequenceUnsaved: boolean;
  testSequenceTree: TestRootNode;
};

type Actions = {
  setCurRun: (val: string[]) => void;
  setWebsocketId: (val: string) => void;
  setElements: (val: (Test | Conditional)[]) => void;
  setIsLocked: (val: boolean) => void;
  setIsLoading: (val: boolean) => void;
  setBackendState: (val: MsgState) => void;
  setTestSequenceUnsaved: (val: boolean) => void;
  setTestSequenceTree: (val: TestRootNode) => void;
};

export const useSequencerStore = create<State & Actions>()(
  immer((set) => ({
    curRun: [],
    websocketId: uuidv4(),
    elements: [],
    isLocked: false,
    isLoading: true,
    backendState: "TEST_SET_DONE",
    testSequenceUnsaved: false,
    testSequenceTree: {
      type: "root",
      children: [],
      identifiers: [],
    },

    setCurRun: (val) =>
      set((state) => {
        state.curRun = val;
      }),
    setWebsocketId: (val) =>
      set((state) => {
        state.websocketId = val;
      }),
    setElements: (val) =>
      set((state) => {
        state.elements = val;
      }),
    setIsLocked: (val) =>
      set((state) => {
        state.isLocked = val;
      }),
    setIsLoading: (val) =>
      set((state) => {
        state.isLoading = val;
      }),
    setBackendState: (val) =>
      set((state) => {
        state.backendState = val;
      }),
    setTestSequenceUnsaved: (val) =>
      set((state) => {
        state.testSequenceUnsaved = val;
      }),

    setTestSequenceTree: (val) =>
      set((state) => {
        state.testSequenceTree = val;
      }),
  })),
);
