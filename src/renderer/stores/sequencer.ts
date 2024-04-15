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
import { testSequenceRunRequest } from "@/renderer/routes/test_sequencer_panel/models/models";
import { toast } from "sonner";
import { createTestSequenceTree } from "@/renderer//hooks/useTestSequencerState";
import { SendJsonMessage } from "react-use-websocket/dist/lib/types";

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
  testSequenceDisplayed: TestSequencerProject | null;
  sequences: TestSequenceContainer[];
  // For upload ~~~~~~~
  uploadAfterRun: boolean;
  serialNumber: string;
  stationId: string;
  integrity: boolean;
  isUploaded: boolean;
  commitHash: string;
  // ~~~~~~~~~~~~~~~~~~
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
  setUploadAfterRun: (val: boolean) => void;
  setSerialNumber: (val: string) => void;
  setIntegrity: (val: boolean) => void;
  setStationId: (val: string) => void;
  setIsUploaded: (val: boolean) => void;
  setCommitHash: (val: string) => void;
  // Cycles
  setCycleCount: (val: number) => void;
  setInfinite: (val: boolean) => void;
  saveCycle: () => void;
  displayPreviousCycle: () => void;
  displayNextCycle: () => void;
  clearPreviousCycles: () => void;
  // Sequences
  setSequences: (val: TestSequenceContainer[]) => void;
  addNewSequence: (
    val: TestSequencerProject,
    elements: TestSequenceElement[],
  ) => void;
  removeSequence: (name: string) => void;
  displaySequence: (name: string) => void;
  runNextRunnableSequence: (sender: SendJsonMessage) => void;
  runRunnableSequencesFromCurrentOne: (sender: SendJsonMessage) => void;
  updateSequenceStatus: (val: StatusType) => void;
};

export const useSequencerStore = create<State & Actions>()(
  immer((set, get) => ({
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
    testSequenceDisplayed: null,
    currentSequence: null,
    sequences: [],
    globalStatus: "pending",
    sequenceStatus: "pending",

    cycleConfig: {
      infinite: false,
      cycleCount: 1,
      ptrCycle: -1,
    },
    cycleRuns: [],

    uploadAfterRun: false,
    setUploadAfterRun: (val) =>
      set((state) => {
        state.uploadAfterRun = val;
      }),
    serialNumber: "",
    setSerialNumber: (sn) => set(() => ({ serialNumber: sn })),
    stationId: "",
    setStationId: (id) => set(() => ({ stationId: id })),
    integrity: false,
    setIntegrity: (val) => set(() => ({ integrity: val })),
    isUploaded: false,
    setIsUploaded: (val) => set(() => ({ isUploaded: val })),
    commitHash: "",
    setCommitHash: (val) => set(() => ({ profileHash: val })),

    setWebsocketId: (val) =>
      set((state) => {
        state.websocketId = val;
      }),
    setElements: (val) =>
      set((state) => {
        state.elements = val;
        if (state.testSequenceDisplayed !== null) {
          const idx = state.sequences.findIndex(
            (seq) => seq.project.name === state.testSequenceDisplayed?.name,
          );
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
          state.testSequenceDisplayed = state.sequences[0].project;
          state.testSequenceStepTree = state.sequences[0].tree;
          state.elements = state.sequences[0].elements;
          state.testSequenceUnsaved = state.sequences[0].testSequenceUnsaved;
        } else {
          state.testSequenceDisplayed = null;
          state.testSequenceStepTree = {
            type: "root",
            children: [],
            identifiers: [],
          };
          state.elements = [];
          state.cycleConfig = {
            infinite: false,
            cycleCount: 1,
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
    setTestSequenceUnsaved: (val) => ({ testSequenceUnsaved: val }),
    setTestSequenceTree: (val) =>
      set((state) => {
        state.testSequenceStepTree = val;
      }),

    // Sequences ===========================================================
    updateSequenceStatus: (val: StatusType) => {
      if (get().testSequenceDisplayed !== null) {
        const currSeqName = get().testSequenceDisplayed?.name;
        const idx = get().sequences.findIndex(
          (seq) => seq.project.name === currSeqName,
        );
        if (idx === -1) {
          return;
        }
        set((state) => {
          state.sequences[idx].status = val;
          if (val === "aborted") {
            state.sequences[idx].elements.forEach((el) => {
              if (
                el.type === "test" &&
                (el.status === "running" || el.status === "paused")
              ) {
                el.status = "aborted";
              }
            });
          }
        });
      }
    },

    runRunnableSequencesFromCurrentOne: (sender) => {
      set((state) => {
        // Clear the sequencer
        resetSequencesStateToPending(state);
        state.clearPreviousCycles();
        // Make sure the Tree is up to date
        state.testSequenceStepTree = createTestSequenceTree(state.elements);
      });
      // Run the first sequence
      sender(testSequenceRunRequest(get().testSequenceStepTree));
    },

    runNextRunnableSequence: (sender) => {
      if (get().testSequenceDisplayed === null) {
        return; // User only has steps
      }
      // Find the current sequence and save it
      const idx = get().sequences.findIndex(
        (seq) => seq.project.name === get().testSequenceDisplayed?.name,
      );
      if (idx === -1 || idx === get().sequences.length - 1) {
        return;
      }
      const currSequence = containerizeCurrentSequence(idx);
      set((state) => {
        state.sequences[idx] = currSequence;
        // Load the next sequence and run it
        let nextIdx = idx + 1;
        while (state.sequences[nextIdx].runable === false) {
          nextIdx = nextIdx + 1;
          if (nextIdx === state.sequences.length) {
            return;
          }
        }
        loadSequenceState(nextIdx, state);
        state.isLocked = true;
      });
      sender(testSequenceRunRequest(get().testSequenceStepTree));
    },

    addNewSequence: (
      project: TestSequencerProject,
      elements: TestSequenceElement[],
    ) => {
      // Check if name is unique
      const idx = get().sequences.findIndex(
        (seq) => seq.project.name === project.name,
      );
      if (idx !== -1) {
        return;
      }
      set((state) => {
        // Save this sequence
        state.sequences.push({
          project: project,
          tree: createTestSequenceTree(elements),
          elements: elements,
          testSequenceUnsaved: false,
          status: "pending",
          runable: true,
        });
      });
    },

    removeSequence: (name) => {
      // Check if sequence exists
      const idx = get().sequences.findIndex((seq) => seq.project.name === name);
      if (idx === -1) {
        return;
      }
      set((state) => {
        // Remove the sequence
        state.sequences.splice(idx, 1);
        // Check if the sequence is displayed
        if (
          state.testSequenceDisplayed !== null &&
          state.testSequenceDisplayed.name === name
        ) {
          if (state.sequences.length !== 0) {
            state.displaySequence(state.sequences[0].project.name);
          } else {
            clearSequencerState(state);
          }
        }
      });
    },

    displaySequence: (name) => {
      // No Sequences, only steps
      if (get().sequences.length === 0) {
        return;
      }
      // Check if sequence already displayed
      if (
        get().testSequenceDisplayed !== null &&
        get().testSequenceDisplayed!.name === name
      ) {
        return;
      }
      // Check if the sequence exists
      const idx = get().sequences.findIndex((seq) => seq.project.name === name);
      if (idx === -1) {
        return;
      }
      set((state) => {
        // save the current sequence if any
        if (state.testSequenceDisplayed !== null) {
          const oldIdx = state.sequences.findIndex(
            (seq) => seq.project.name === state.testSequenceDisplayed?.name,
          );
          if (oldIdx !== -1) {
            // Could be -1 if the sequence was removed
            const oldSequence = containerizeCurrentSequence(oldIdx);
            state.sequences[oldIdx] = oldSequence;
          }
        }
        // Load the new sequence
        loadSequenceState(idx, state);
      });
    },

    // Cycles state management ===================================
    setCycleCount: (val: number) => {
      if (val < 1) {
        set((state) => {
          state.cycleConfig.cycleCount = 1;
          state.cycleConfig.infinite = true;
        });
      } else {
        set((state) => {
          state.cycleConfig.cycleCount = val;
          state.cycleConfig.infinite = false;
        });
      }
    },

    setInfinite: (val: boolean) =>
      set((state) => {
        state.cycleConfig.infinite = val;
      }),
    saveCycle: () => {
      if (
        get().cycleRuns.length > get().cycleConfig.cycleCount &&
        get().cycleConfig.infinite === false
      ) {
        return;
      }

      set((state) => {
        state.cycleRuns.push(state.sequences.map((seq) => ({ ...seq })));
        state.cycleConfig.ptrCycle = state.cycleRuns.length - 1;
      });
    },
    displayPreviousCycle: () => {
      if (get().cycleConfig.ptrCycle <= 0) {
        toast.info("No previous cycle");
        return;
      }
      // Save the current sequence
      const currName = get().testSequenceDisplayed?.name;
      const currentSeqIdx = get().sequences.findIndex(
        (seq) => seq.project.name === currName,
      );
      set((state) => {
        if (currentSeqIdx !== -1) {
          const currentSequence = containerizeCurrentSequence(currentSeqIdx);
          state.sequences[currentSeqIdx] = currentSequence;
        }
        // Load the previous cycle
        state.cycleConfig.ptrCycle = state.cycleConfig.ptrCycle - 1;
        state.sequences = state.cycleRuns[state.cycleConfig.ptrCycle];
        // Load the first sequence (without saving the previous one)
        loadSequenceState(0, state);
      });
    },
    displayNextCycle: () => {
      if (get().cycleConfig.ptrCycle >= get().cycleRuns.length - 1) {
        return;
      }
      // Save the current cycle
      const currName = get().testSequenceDisplayed?.name;
      const currentIdx = get().sequences.findIndex(
        (seq) => seq.project.name === currName,
      );
      set((state) => {
        if (currentIdx !== -1) {
          const currentSequence = containerizeCurrentSequence(currentIdx);
          state.sequences[currentIdx] = currentSequence;
        }
        // Load the previous cycle
        state.cycleConfig.ptrCycle = state.cycleConfig.ptrCycle + 1;
        state.sequences = state.cycleRuns[state.cycleConfig.ptrCycle];
        // Load the first sequence (without saving the previous one)
        loadSequenceState(currentIdx, state);
      });
    },

    clearPreviousCycles: () =>
      set((state) => {
        state.cycleConfig.ptrCycle = -1;
        state.cycleRuns = [];
      }),
  })),
);

// Helper functions ==========================================================

function containerizeCurrentSequence(
  containerIdx: number,
): TestSequenceContainer {
  const state = useSequencerStore.getState();
  const container = {
    project: { ...state.testSequenceDisplayed! },
    tree: { ...state.testSequenceStepTree },
    elements: [...state.elements],
    testSequenceUnsaved: state.testSequenceUnsaved,
    status: state.sequences[containerIdx].status,
    runable: state.sequences[containerIdx].runable,
  };
  return container;
}

function loadSequenceState(idx: number, stateSetter: State & Actions): void {
  if (idx < 0 || idx >= stateSetter.sequences.length) {
    return;
  }
  stateSetter.testSequenceDisplayed = stateSetter.sequences[idx].project;
  stateSetter.testSequenceStepTree = stateSetter.sequences[idx].tree;
  stateSetter.elements = stateSetter.sequences[idx].elements;
  stateSetter.testSequenceUnsaved =
    stateSetter.sequences[idx].testSequenceUnsaved;
}

function clearSequencerState(stateSetter: State & Actions): void {
  stateSetter.testSequenceDisplayed = null;
  stateSetter.testSequenceStepTree = {
    type: "root",
    children: [],
    identifiers: [],
  };
  stateSetter.cycleRuns = [];
  stateSetter.elements = [];
  stateSetter.cycleConfig = {
    infinite: false,
    cycleCount: 1,
    ptrCycle: -1,
  };
  stateSetter.testSequenceUnsaved = false;
}

function resetSequencesStateToPending(stateSetter: State & Actions): void {
  // Clean up all containers
  stateSetter.sequences.forEach((seq: TestSequenceContainer) => {
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
    if (seq.project.name === stateSetter.testSequenceDisplayed?.name) {
      stateSetter.elements = newElems;
      stateSetter.testSequenceStepTree = seq.tree;
    }
  });

  // Clean up the current display
  const newElems = [...stateSetter.elements].map((elem) => {
    return elem.type === "test"
      ? {
          ...elem,
          status: StatusType.parse("pending"),
          completionTime: undefined,
          isSavedToCloud: false,
        }
      : { ...elem };
  });
  stateSetter.elements = newElems;
}
