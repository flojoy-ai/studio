import {
  Test,
  TestSequenceElement,
  TestRootNode,
  TestSequenceElementNode,
  IfNode,
  TestNode,
  TestType,
  TestSequencerProject,
} from "@/renderer/types/test-sequencer";
import {
  checkUniqueNames,
  validateStructure,
  validator,
} from "@/renderer/lib/validate-test-sequence";
import useWithPermission from "@/renderer/hooks/useWithPermission";
import { useSequencerStore } from "@/renderer/stores/sequencer";
import { useShallow } from "zustand/react/shallow";
import { v4 as uuidv4 } from "uuid";
import { Err, Ok, Result, err, ok } from "neverthrow";
import { verifyElementCompatibleWithSequence } from "@/renderer/routes/test_sequencer_panel/utils/SequenceHandler";
import { toast } from "sonner";
import { SendJsonMessage } from "react-use-websocket/dist/lib/types";
import { postSession } from "@/renderer/lib/api";
import {
  testSequencePauseRequest,
  testSequenceResumeRequest,
  testSequenceStopRequest,
} from "../routes/test_sequencer_panel/models/models";
import { produce } from "immer";

// sync this with the definition of setElems
export type SetElemsFn = {
  (elems: TestSequenceElement[]): void;
  (fn: (elems: TestSequenceElement[]) => TestSequenceElement[]): void;
};

/**
 * Creates the test sequence tree from the test sequence element list.
 * This test sequence element is guaranteed to be valid.
 * @param elems - The array of test sequence elements
 */
export const createTestSequenceTree = (
  elems: TestSequenceElement[],
): TestRootNode => {
  const identifiers = (
    elems.filter((elem) => elem.type === "test") as Test[]
  ).map((elem: Test) => {
    return elem.testName;
  });

  const root = {
    type: "root",
    children: [],
    identifiers: identifiers,
  } as TestRootNode;

  const stack: TestSequenceElementNode[][] = [root.children];

  for (let i = 0; i < elems.length; i++) {
    const curElem = elems[i];

    //handle non-leaf nodes
    if (curElem.type === "conditional") {
      switch (curElem.conditionalType) {
        case "if":
          // eslint-disable-next-line no-case-declarations
          const ifNode: IfNode = {
            ...curElem,
            main: [],
            else: [],
          } as IfNode;
          (stack.at(-1) as TestSequenceElementNode[]).push(ifNode);
          stack.push(ifNode.else); // push else to stack so that when we reach else statement we just pop if array
          stack.push(ifNode.main);
          break;
        case "else":
          stack.pop();
          break;
        case "end":
          stack.pop();
          break;
      }
      continue;
    }

    //handle leaf nodes
    const testNode: TestNode = { ...curElem };
    (stack.at(-1) as TestSequenceElementNode[]).push(testNode);
  }
  return root;
};

const validateElements = (
  validators: validator[],
  elems: TestSequenceElement[],
): boolean => {
  return !validators.some((validator) => !validator(elems), validators);
};

export function createNewTest(
  name: string,
  path: string,
  type: TestType,
  exportToCloud?: boolean,
  id?: string,
  groupId?: string,
  minValue?: number,
  maxValue?: number,
  unit?: string,
  args?: string[],
): Test {
  const newTest: Test = {
    type: "test",
    id: id || uuidv4(),
    groupId: groupId || uuidv4(),
    path: path,
    testName: name,
    runInParallel: false,
    testType: type,
    status: "pending",
    completionTime: undefined,
    error: null,
    isSavedToCloud: false,
    exportToCloud: exportToCloud === undefined ? true : exportToCloud,
    createdAt: new Date().toISOString(),
    minValue: minValue,
    maxValue: maxValue,
    unit: unit,
    args: args,
  };
  return newTest;
}

export function useDisplayedSequenceState() {
  const {
    elems,
    setElements,
    isLocked,
    setIsLocked,
    backendGlobalState,
    setBackendGlobalState,
    backendState,
    setBackendState,
    isUnsaved,
    setUnsaved,
    tree,
    setTree,
    project,
  } = useSequencerStore(
    useShallow((state) => {
      return {
        elems: state.elements,
        setElements: state.setElements,
        isLocked: state.isLocked,
        setIsLocked: state.setIsLocked,
        backendGlobalState: state.backendGlobalState,
        setBackendGlobalState: state.setBackendGlobalState,
        backendState: state.playPauseState,
        setBackendState: state.setBackendState,
        isUnsaved: state.testSequenceUnsaved,
        setUnsaved: state.setTestSequenceUnsaved,
        tree: state.testSequenceStepTree,
        setTree: state.setTestSequenceTree,
        project: state.testSequenceDisplayed,
      };
    }),
  );

  const { withPermissionCheck } = useWithPermission();

  // wrapper around setElements to check if elems is valid
  function setElems(
    p:
      | TestSequenceElement[]
      | ((elems: TestSequenceElement[]) => TestSequenceElement[]),
  ): Result<void, Error> {
    let candidateElems: TestSequenceElement[];

    // handle overloads
    if (Array.isArray(p)) {
      candidateElems = p;
    } else {
      candidateElems = p(elems);
    }

    // validate new elements
    const res = validateElements(
      [validateStructure, checkUniqueNames],
      candidateElems,
    );
    if (!res) {
      console.error("Validation failed");
      return err(new Error("Validation failed"));
    }

    // PASS
    setElements(candidateElems);
    setUnsaved(true);

    // creates tree to send to backend
    setTree(createTestSequenceTree(candidateElems));
    return ok(undefined);
  }

  const setElemsWithPermissions = withPermissionCheck(setElems);

  async function AddNewElems(
    newElems: TestSequenceElement[],
  ): Promise<Result<void, Error>> {
    // Validate with project
    if (project !== null) {
      const result = await verifyElementCompatibleWithSequence(
        project,
        newElems,
      );
      if (result.isErr()) {
        return new Err(result.error);
      }
    }
    // Add new elements
    const result = setElems((elems) => [...elems, ...newElems]);
    return result;
  }

  const addNewElemsWithPermissions = withPermissionCheck(AddNewElems);

  return {
    elems,
    setElems: setElemsWithPermissions,
    addNewElems: addNewElemsWithPermissions,
    tree,
    setIsLocked,
    setBackendState,
    setBackendGlobalState,
    isLocked,
    backendState,
    backendGlobalState,
    setUnsaved,
    isUnsaved,
    project,
  };
}

export function useSequencerState() {
  const {
    clearState,
    elements,
    setElements,
    isLocked,
    setIsLocked,
    tree,
    project,
    uploadAfterRun,
    backendGlobalState,
    serialNumber,
    stationId,
    integrity,
    commitHash,
    setIsUploaded,
    sequences,
    setSequences,
    runRunnableSequencesFromCurrentOne,
    runNextRunnableSequence,
    displaySequence,
    addNewSequence,
    removeSequence,
    cycleConfig,
    saveCycle,
    cycleRuns,
    clearPreviousCycles,
  } = useSequencerStore(
    useShallow((state) => {
      return {
        clearState: state.clearState,
        elements: state.elements,
        setElements: state.setElements,
        isLocked: state.isLocked,
        setIsLocked: state.setIsLocked,
        tree: state.testSequenceStepTree,
        project: state.testSequenceDisplayed,
        uploadAfterRun: state.uploadAfterRun,
        backendGlobalState: state.backendGlobalState,
        serialNumber: state.serialNumber,
        stationId: state.stationId,
        integrity: state.integrity,
        commitHash: state.commitHash,
        setIsUploaded: state.setIsUploaded,
        sequences: state.sequences,
        setSequences: state.setSequences,
        runRunnableSequencesFromCurrentOne:
          state.runRunnableSequencesFromCurrentOne,
        runNextRunnableSequence: state.runNextRunnableSequence,
        displaySequence: state.displaySequence,
        addNewSequence: state.addNewSequence,
        removeSequence: state.removeSequence,
        // Cycles
        cycleConfig: state.cycleConfig,
        saveCycle: state.saveCycle,
        cycleRuns: state.cycleRuns,
        clearPreviousCycles: state.clearPreviousCycles,
      };
    }),
  );

  const { withPermissionCheck } = useWithPermission();

  function addNewSeq(
    val: TestSequencerProject,
    elements: TestSequenceElement[],
  ): void {
    addNewSequence(val, elements);
    displaySequence(val.name);
  }

  function displaySeq(name: string): void {
    if (!isLocked) {
      displaySequence(name);
    }
  }

  function runNextRunnableSequenceAndCycle(sender: SendJsonMessage): void {
    if (project === null) {
      handleUpload(false);
      return; // User only has steps
    }
    // Check if we are at the end of a cycle
    let lastRunnableSequenceIdx = -1;
    sequences.forEach((seq, idx) => {
      if (seq.runable) {
        lastRunnableSequenceIdx = idx;
      }
    });
    const currentIdx = sequences.findIndex(
      (seq) => seq.project.name === project.name,
    );
    if (
      currentIdx === lastRunnableSequenceIdx &&
      sequences[currentIdx].status !== "pending"
    ) {
      // Save cycle & run next the next one
      saveCycle(); // Won't update the lenght of cycleRuns right away
      if (
        cycleRuns.length < cycleConfig.cycleCount - 1 ||
        cycleConfig.infinite
      ) {
        const idx = sequences.findIndex((seq) => seq.runable);
        if (idx !== -1) {
          setIsLocked(true);
          displaySequence(sequences[idx].project.name);
          runRunnableSequencesFromCurrentOne(sender);
        }
      } else {
        handleUpload(false, false);
      }
    } else {
      // Run next sequence
      runNextRunnableSequence(sender);
    }
  }

  function handleUpload(aborted: boolean, forceUpload: boolean = false) {
    if (uploadAfterRun || forceUpload) {
      if (project === null) {
        toast.warning("No sequence to upload, please create one.");
        return;
      }
      const upload = async () => {
        await postSession(
          serialNumber,
          stationId,
          integrity,
          aborted,
          commitHash,
          [...useSequencerStore.getState().cycleRuns],
        );
      };
      toast.promise(upload, {
        loading: "Uploading result...",
        success: () => {
          setIsUploaded(true);
          return "Uploaded result to cloud";
        },
        error: (err) => {
          return `Failed to upload result: ${err}`;
        },
      });
    }
  }

  function isValidCloudExport(): boolean {
    if (uploadAfterRun) {
      if (serialNumber === "") {
        toast.error("Please fill in the serial number.");
        return false;
      }
      if (stationId === "") {
        toast.error("Please select a station.");
        return false;
      }
    }
    return true;
  }

  function runSequencer(sender: SendJsonMessage): void {
    if (!isValidCloudExport()) {
      return;
    }
    setIsUploaded(false);
    if (sequences.length === 0) {
      // No sequence ? Run the loaded test step.
      setIsLocked(true);
      runRunnableSequencesFromCurrentOne(sender);
    } else {
      clearPreviousCycles();
      // Run from the first runable sequence
      const idx = sequences.findIndex((seq) => seq.runable);
      if (idx !== -1) {
        setIsLocked(true);
        displaySequence(sequences[idx].project.name);
        runRunnableSequencesFromCurrentOne(sender);
      } else {
        toast.info("No sequence selected to run.");
      }
    }
  }

  function abortSequencer(sender: SendJsonMessage) {
    toast.warning("Stopping sequencer after this test.");
    sender(testSequenceStopRequest(tree));
    // Paused test and never not yet run
    setElements(
      produce(elements, (draft) => {
        for (const el of draft) {
          if (el.type === "test" && el.status === "paused") {
            el.status = "pending";
          }
        }
      }),
    );
    setIsLocked(false);
  }

  function pauseSequencer(sender: SendJsonMessage) {
    if (backendGlobalState === "test_set_start") {
      toast.warning("Pausing sequencer after this test.");
      console.log("Pause test");
      sender(testSequencePauseRequest(tree));
    }
  }

  function resumeSequencer(sender: SendJsonMessage) {
    if (backendGlobalState === "test_set_start") {
      toast.info("Resuming sequencer.");
      console.log("Resume test");
      sender(testSequenceResumeRequest(tree));
    }
  }

  function clearSequencer() {
    if (isLocked) {
      toast.error("Cannot clear sequencer while running.");
      return;
    }
    clearState();
  }

  const setSequencesWithPermissions = withPermissionCheck(setSequences);

  return {
    sequences,
    setSequences: setSequencesWithPermissions,
    runSequencer,
    abortSequencer,
    pauseSequencer,
    resumeSequencer,
    runNextRunnableSequence: runNextRunnableSequenceAndCycle,
    displaySequence: displaySeq,
    addNewSequence: addNewSeq,
    removeSequence,
    handleUpload: handleUpload,
    clearSequencer,
  };
}
