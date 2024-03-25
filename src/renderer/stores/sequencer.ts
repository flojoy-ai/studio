import { v4 as uuidv4 } from "uuid";
import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import {
    BackendGlobalState,
  CycleConfig,
  MsgState,
  StatusType,
  TestRootNode,
  TestSequenceContainer,
  TestSequenceElement,
} from "@/renderer/types/test-sequencer";
import { TestSequencerProject } from "@/renderer/types/test-sequencer";
import { testSequenceRunRequest } from "../routes/test_sequencer_panel/models/models";

type State = {
  websocketId: string;
  elements: TestSequenceElement[];
  isLocked: boolean;
  isLoading: boolean;
  backendGlobalState: BackendGlobalState;
  cycleConfig: CycleConfig;
  cycleRuns: TestSequenceContainer[][];
  playPauseState: MsgState;
  testSequenceUnsaved: boolean;
  testSequenceStepTree: TestRootNode;
  testSequencerDisplayed: TestSequencerProject | null;
  sequences: TestSequenceContainer[];
};

type Actions = {
  setWebsocketId: (val: string) => void;
  setElements: (val: TestSequenceElement[]) => void;
  setIsLocked: (val: boolean) => void;
  setIsLoading: (val: boolean) => void;
  setBackendGlobalState: (val: BackendGlobalState) => void;
  setBackendState: (val: MsgState) => void;
  setTestSequenceUnsaved: (val: boolean) => void;
  setTestSequenceTree: (val: TestRootNode) => void;
  // Cycles
  setCycleCount: (val: number) => void;
  setInfinite: (val: boolean) => void;
  saveCycle: () => void;
  diplayPreviousCycle: () => void;
  displayNextCycle: () => void;
  clearPreviousCycles: () => void;
  // Sequences
  setSequences: (val: TestSequenceContainer[]) => void;
  addNewSequence: (val: TestSequencerProject, elements: TestSequenceElement[]) => void;
  removeSequence: (name: string) => void;
  displaySequence: (name: string) => void;
  runNextRunnableSequence: (sender: any) => void;
  runRunnableSequences: (sender: any) => void;
  updateSequenceStatus: (val: StatusType) => void;
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
    backendGlobalState: "test_set_done",
    playPauseState: "test_set_done",
    testSequenceUnsaved: false,
    testSequenceStepTree: {
      type: "root",
      children: [],
      identifiers: [],
    },
    testSequencerDisplayed: null,
    currentSequence: null,
    sequences: [],
    globalStatus: "pending",
    sequenceStatus: "pending",

    cycleConfig: {
      infinite: false,
      cycleCount: 1,
      cycleNumber: 0,
      ptrCycle: -1,
    },
    cycleRuns: [],

    setWebsocketId: (val) =>
      set((state) => {
        state.websocketId = val;
      }),
    setElements: (val) =>
      set((state) => {
        state.elements = val;
        if (state.testSequencerDisplayed !== null) {
          const idx = state.sequences.findIndex((seq) => seq.project.name === state.testSequencerDisplayed?.name);
          if (idx !== -1) {
            state.sequences[idx].elements = val;
            state.testSequenceUnsaved = true;
          }
        }
      }),
    setSequences: (val) =>
      set((state) => {
        state.sequences = val;
        if (state.sequences.length > 0) {
          // Problem here
          state.testSequencerDisplayed = state.sequences[0].project;
          state.testSequenceStepTree = state.sequences[0].tree;
          state.elements = state.sequences[0].elements;
          state.testSequenceUnsaved = state.sequences[0].testSequenceUnsaved;
        } else {
          state.testSequencerDisplayed = null;
          state.testSequenceStepTree = {
            type: "root",
            children: [],
            identifiers: [],
          };
          state.elements = [];
          state.cycleConfig = {
            infinite: false,
            cycleCount: 1,
            cycleNumber: 0,
            ptrCycle: -1,
          };
          state.testSequenceUnsaved = false;
        }
      }),
    setBackendState: (val) =>
      set((state) => {
        state.playPauseState = val;
      }),
    setBackendGlobalState: (val) =>
      set((state) => {
        state.backendGlobalState = val;
      }),
    setTestSequenceUnsaved: (val) =>
      set((state) => {
        state.testSequenceUnsaved = val;
      }),
    setTestSequenceTree: (val) =>
      set((state) => {
        state.testSequenceStepTree = val;
      }),
    updateSequenceStatus: (val: StatusType) =>
      set((state) => {
        if (state.testSequencerDisplayed !== null) {
          const idx = state.sequences.findIndex(
            (seq) => seq.project.name === state.testSequencerDisplayed?.name,
          );
          if (idx === -1) {
            return;
          }
          console.log("Updating sequence status", val);
          state.sequences[idx].status = val;
        }
      }),

    // Navigation through sequences
    runNextRunnableSequence: (sender) =>
      set((state) => {
        if (state.testSequencerDisplayed === null) {
          return;  // User only has steps
        }
        // Find the current sequence and save it
        const idx = state.sequences.findIndex(
          (seq) => seq.project.name === state.testSequencerDisplayed?.name,
        );
        if (idx === -1 || idx === state.sequences.length - 1) {
          return;
        }
        const currSequence = {
          project: { ...state.testSequencerDisplayed },
          cycle: { ...state.cycleConfig },
          tree: { ...state.testSequenceStepTree },
          elements: [...state.elements],
          testSequenceUnsaved: state.testSequenceUnsaved,
          status: state.sequences[idx].status,
          run: state.sequences[idx].runable,
          cycleRuns: state.cycleRuns,
        };
        state.sequences[idx] = currSequence;
        // Load the next sequence and run it
        let nextIdx = idx + 1;
        while (state.sequences[nextIdx].runable === false) {
          nextIdx = nextIdx + 1;
          if (nextIdx === state.sequences.length) {
            return;
          }
        }
        state.testSequencerDisplayed = state.sequences[nextIdx].project;
        state.testSequenceStepTree = state.sequences[nextIdx].tree;
        state.elements = state.sequences[nextIdx].elements;
        state.testSequenceUnsaved = state.sequences[nextIdx].testSequenceUnsaved;
        sender(testSequenceRunRequest(state.testSequenceStepTree));
        state.isLocked = true;
      }),

    runRunnableSequences: (sender) =>
      set((state) => {
        if (state.testSequencerDisplayed !== null) {
          state.sequences.forEach((seq) => {
            // Clean up the sequence
            const newElems: TestSequenceElement[] = [...seq.elements].map((elem) => {
              return elem.type === "test"
                ? {
                    ...elem,
                    status: "pending",
                    completionTime: undefined,
                    isSavedToCloud: false,
                  }
                : { ...elem };
            });
            seq.elements = newElems;
            seq.status = "pending";
            if (seq.project.name === state.testSequencerDisplayed?.name) {
              state.elements = newElems;
              state.testSequenceStepTree = seq.tree;
              state.cycleConfig.ptrCycle = -1;
              state.cycleConfig.cycleNumber = 0;
            }
          });
          state.cycleRuns = [];
        } else {
          const newElems = [...state.elements].map((elem) => {
            return elem.type === "test"
              ? {
                  ...elem,
                  status: StatusType.parse("pending"),
                  completionTime: undefined,
                  isSavedToCloud: false,
                }
              : { ...elem };
          });
          state.elements = newElems;
          state.clearPreviousCycles();
        }
        sender(testSequenceRunRequest(state.testSequenceStepTree));
      }),


    addNewSequence: (project: TestSequencerProject, elements: TestSequenceElement[]) => 
      set((state) => {
        // Check if name is unique
        const idx = state.sequences.findIndex((seq) => seq.project.name === project.name);
        if (idx !== -1) {
          return;
        }
        // Save this sequence
        state.sequences.push({
          project: project,
          tree: { type: "root", children: elements, identifiers: []},
          elements: elements,
          testSequenceUnsaved: false,
          status: "pending",
          runable: true,
        });
      }),
    
    removeSequence: (name) =>
      set((state) => {
        // Check if sequence exists
        const idx = state.sequences.findIndex((seq) => seq.project.name === name);
        if (idx === -1) {
          return;
        }
        // Remove the sequence
        state.sequences.splice(idx, 1);
        // Check if the sequence is displayed
        if (state.testSequencerDisplayed !== null && state.testSequencerDisplayed.name === name) {
          if (state.sequences.length !== 0) {
            state.displaySequence(state.sequences[0].project.name);
          } else {
            clearSequencer(state);
          }
        }
      }),

    displaySequence: (name) =>
      set((state) => {
        // No Sequences, only steps
        if (state.sequences.length === 0) {
          return
        }
        // Check if sequence already displayed
        if (state.testSequencerDisplayed !== null && state.testSequencerDisplayed.name === name) {
          return
        }
        // Check if the sequence exists
        const idx = state.sequences.findIndex(
          (seq) => seq.project.name === name);
        if (idx === -1) {
          return
        }
        // save the current sequence if any
        if (state.testSequencerDisplayed !== null) {
          const oldIdx = state.sequences.findIndex(
            (seq) => seq.project.name === state.testSequencerDisplayed?.name);
          const oldSequence = containerizeSequence(oldIdx, state);
          state.sequences[oldIdx] = oldSequence;
        }
        // Load the new sequence
        loadSequence(idx, state);
      }),

    // Cycles state management ===================================
    setCycleCount: (val: number) =>
      set((state) => {
        console.log("setCycleCount", val);
        if (val < 1) {
          state.cycleConfig.cycleCount = 1;
          state.cycleConfig.infinite = true;
        } else {
          state.cycleConfig.cycleCount = val;
          state.cycleConfig.infinite = false;
        }
      }),
    setInfinite: (val: boolean) =>
      set((state) => {
        state.cycleConfig.infinite = val;
      }),
    saveCycle: () => 
      set((state) => {
        // TODO
      }),
    diplayPreviousCycle: () =>
      set((state) => {
        // TODO
      }),
    displayNextCycle: () =>
      set((state) => {
        // TODO
      }),
    clearPreviousCycles: () =>
      set((state) => {
        // TODO
      }),  

  })),
);

function containerizeSequence(containerIdx: number, state: any): TestSequenceContainer {
  const container = {
    project: { ...state.testSequencerDisplayed },
    tree: { ...state.testSequenceStepTree },
    elements: [...state.elements],
    testSequenceUnsaved: state.testSequenceUnsaved,
    status: state.sequences[containerIdx].status,
    runable: state.sequences[containerIdx].runable,
  };
  return container;
}


function loadSequence(idx: number, state: any): void {
  state.testSequencerDisplayed = state.sequences[idx].project;
  state.testSequenceStepTree = state.sequences[idx].tree;
  state.elements = state.sequences[idx].elements;
  state.cycleConfig = state.sequences[idx].cycle;
  state.testSequenceUnsaved = state.sequences[idx].testSequenceUnsaved;
}


function clearSequencer(state: any): void {
  state.testSequencerDisplayed = null;
  state.testSequenceStepTree = {
    type: "root",
    children: [],
    identifiers: [],
  };
  state.elements = [];
  state.cycleConfig = {
    infinite: false,
    cycleCount: 1,
    cycleNumber: 0,
    ptrCycle: -1,
  };
  state.testSequenceUnsaved = false;
}
