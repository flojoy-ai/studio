import { v4 as uuidv4 } from "uuid";

import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import {
  MsgState,
  TestRootNode,
  TestSequenceElement,
} from "@/renderer/types/testSequencer";

type State = {
  curRun: string[];
  websocketId: string;
  elements: TestSequenceElement[];
  isLocked: boolean;
  isLoading: boolean;
  backendState: MsgState;
  testSequenceUnsaved: boolean;
  testSequenceTree: TestRootNode;
};

type Actions = {
  markTestAsDone: (val: string) => void;
  addTestToRunning: (val: string) => void;

  setWebsocketId: (val: string) => void;
  setElements: (val: TestSequenceElement[]) => void;
  setIsLocked: (val: boolean) => void;
  setIsLoading: (val: boolean) => void;
  setBackendState: (val: MsgState) => void;
  setTestSequenceUnsaved: (val: boolean) => void;
  setTestSequenceTree: (val: TestRootNode) => void;
};

export const useSequencerStore = create<State & Actions>()(
  immer((set) => ({
    isLocked: false,
    setIsLocked: (val) =>
      set((state) => {
        state.isLocked = val;
      }),

    isLoading: true,
    setIsLoading: (val) =>
      set((state) => {
        state.isLoading = val;
      }),

    curRun: [],
    websocketId: uuidv4(),
    elements: [],
    backendState: "test_set_done",
    testSequenceUnsaved: false,
    testSequenceTree: {
      type: "root",
      children: [],
      identifiers: [],
    },

    markTestAsDone: (val) =>
      set((state) => {
        state.curRun = state.curRun.filter((v) => v !== val);
      }),
    addTestToRunning: (val) =>
      set((state) => {
        state.curRun.push(val);
      }),

    setWebsocketId: (val) =>
      set((state) => {
        state.websocketId = val;
      }),
    setElements: (val) =>
      set((state) => {
        state.elements = val;
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
