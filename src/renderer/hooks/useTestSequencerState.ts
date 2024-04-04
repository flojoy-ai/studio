import {
  Test,
  TestSequenceElement,
  TestRootNode,
  TestSequenceElementNode,
  IfNode,
  TestNode,
  TestType,
  TestSequencerProject,
  TestSequenceContainer,
  CycleConfig,
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
import { Err, Ok, Result } from "neverthrow";
import { verifyElementCompatibleWithSequence } from "@/renderer/routes/test_sequencer_panel/utils/SequenceHandler";
import { toast } from "sonner";
import { SendJsonMessage } from "react-use-websocket/dist/lib/types";
import { postSession } from "@/renderer/lib/api";

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
  };
  return newTest;
}

export function useTestSequencerState() {
  const {
    elems,
    setElements,
    websocketId,
    isLoading,
    setIsLoading,
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
    uploadAfterRun,
    setUploadAfterRun,
    uploadInfo,
    setStationId,
    setSerialNumber,
    setIntegrity,
    setIsUploaded,
    // Sequences
    sequences,
    setSequences,
    runRunnableSequencesFromCurrentOne,
    runNextRunnableSequence,
    displaySequence,
    updateSequenceStatus,
    addNewSequence,
    removeSequence,
    // Cycles
    cycleConfig,
    setCycleCount,
    setInfinite,
    saveCycle,
    cycleRuns,
    diplayPreviousCycle,
    displayNextCycle,
    clearPreviousCycles,
  } = useSequencerStore(
    useShallow((state) => {
      return {
        elems: state.elements,
        setElements: state.setElements,
        websocketId: state.websocketId,
        isLoading: state.isLoading,
        setIsLoading: state.setIsLoading,
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
        uploadAfterRun: state.uploadAfterRun,
        setUploadAfterRun: state.setUploadAfterRun,
        uploadInfo: state.uploadInfo,
        setStationId: state.setStationId,
        setSerialNumber: state.setSerialNumber,
        setIntegrity: state.setIntegrity,
        setIsUploaded: state.setIsUploaded,
        // Sequences
        sequences: state.sequences,
        setSequences: state.setSequences,
        runRunnableSequencesFromCurrentOne:
          state.runRunnableSequencesFromCurrentOne,
        runNextRunnableSequence: state.runNextRunnableSequence,
        displaySequence: state.displaySequence,
        updateSequenceStatus: state.updateSequenceStatus,
        addNewSequence: state.addNewSequence,
        removeSequence: state.removeSequence,
        // Cycles
        cycleConfig: state.cycleConfig,
        setCycleCount: state.setCycleCount,
        setInfinite: state.setInfinite,
        saveCycle: state.saveCycle,
        cycleRuns: state.cycleRuns,
        diplayPreviousCycle: state.diplayPreviousCycle,
        displayNextCycle: state.displayNextCycle,
        clearPreviousCycles: state.clearPreviousCycles,
      };
    }),
  );

  const { withPermissionCheck } = useWithPermission();

  // wrapper around setElements to check if elems is valid
  function setElems(
    p:
      | TestSequenceElement[]
      | ((elems: TestSequenceElement[]) => TestSequenceElement[]),
  ) {
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
      return;
    }

    // PASS
    setElements(candidateElems);
    setUnsaved(true);

    // creates tree to send to backend
    setTree(createTestSequenceTree(candidateElems));
  }

  const setElemsWithPermissions = withPermissionCheck(setElems);

  async function AddNewElems(
    newElems: TestSequenceElement[],
  ): Promise<Result<null, Error>> {
    // Validate with project
    if (project !== null) {
      const result = await verifyElementCompatibleWithSequence(
        project,
        newElems,
        false,
      );
      if (!result.ok) {
        return new Err(result.error);
      }
    }
    // Add new elements
    setElems((elems) => [...elems, ...newElems]);
    return new Ok(null);
  }

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
      handleUpload();
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
        handleUpload(false);
      }
    } else {
      // Run next sequence
      runNextRunnableSequence(sender);
    }
  }

  function handleUpload(forceUpload: boolean = false) {
    if (uploadAfterRun || forceUpload) {
      if (project === null) {
        toast.warning("No sequence to upload, please create one.");
        return;
      }
      const upload = async () => {
        await postSession(
          uploadInfo.serialNumber,
          uploadInfo.stationId,
          uploadInfo.integrity,
          "",
          [...useSequencerStore.getState().cycleRuns]
        ); 
      };
      toast.promise(upload, 
        {
          loading: "Uploading result...", 
          success: () => {
            setIsUploaded(true);
            return  "Uploaded result to cloud";
          }
        }
      );
    }
  }

  function runSequencer(sender: SendJsonMessage): void {
    setIsUploaded(false);
    if (project === null) {
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

  const addNewElemsWithPermissions = withPermissionCheck(AddNewElems);
  const setSequencesWithPermissions = withPermissionCheck(setSequences);

  return {
    elems,
    websocketId,
    setElems: setElemsWithPermissions,
    AddNewElems: addNewElemsWithPermissions,
    tree,
    setIsLocked,
    setBackendState,
    setBackendGlobalState,
    isLocked,
    isLoading,
    backendState,
    backendGlobalState,
    setIsLoading,
    setUnsaved,
    isUnsaved,
    project,
    // Sequences
    sequences,
    setSequences: setSequencesWithPermissions,
    runSequencer,
    runNextRunnableSequence: runNextRunnableSequenceAndCycle,
    displaySequence: displaySeq,
    updateSequenceStatus,
    addNewSequence: addNewSeq,
    removeSequence,
    // Cycles
    cycleConfig,
    cycleRuns,
    setCycleCount,
    setInfinite,
    saveCycle,
    diplayPreviousCycle,
    displayNextCycle,
    clearPreviousCycles,
    // Upload
    uploadAfterRun,
    setUploadAfterRun,
    uploadInfo,
    handleUpload,
    setStationId,
    setSerialNumber,
    setIntegrity,
    setIsUploaded,
  };
}
