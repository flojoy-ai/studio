import {
  Test,
  TestSequenceElement,
  TestRootNode,
  TestSequenceElementNode,
  IfNode,
  TestNode,
  TestType,
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
import { verifyElementCompatibleWithProject } from "@/renderer/utils/TestSequenceProjectHandler";

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
const createTestSequenceTree = (elems: TestSequenceElement[]): TestRootNode => {
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
    running,
    markTestAsDone,
    addTestToRunning,
    isLoading,
    setIsLoading,
    isLocked,
    setIsLocked,
    backendState,
    setBackendState,
    isUnsaved,
    setUnsaved,
    tree,
    setTree,
    project,
    setProject,
  } = useSequencerStore(
    useShallow((state) => {
      return {
        elems: state.elements,
        setElements: state.setElements,
        websocketId: state.websocketId,
        running: state.curRun,
        markTestAsDone: state.markTestAsDone,
        addTestToRunning: state.addTestToRunning,
        isLoading: state.isLoading,
        setIsLoading: state.setIsLoading,
        isLocked: state.isLocked,
        setIsLocked: state.setIsLocked,
        backendState: state.backendState,
        setBackendState: state.setBackendState,
        isUnsaved: state.testSequenceUnsaved,
        setUnsaved: state.setTestSequenceUnsaved,
        tree: state.testSequenceTree,
        setTree: state.setTestSequenceTree,
        project: state.testSequencerProject,
        setProject: state.setTestSequencerProject,
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
      const result = await verifyElementCompatibleWithProject(
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

  const addNewElemsWithPermissions = withPermissionCheck(AddNewElems);

  return {
    elems,
    websocketId,
    setElems: setElemsWithPermissions,
    AddNewElems: addNewElemsWithPermissions,
    tree,
    running,
    markTestAsDone,
    addTestToRunning,
    setIsLocked,
    setBackendState,
    isLocked,
    isLoading,
    backendState,
    setIsLoading,
    setUnsaved,
    isUnsaved,
    project,
    setProject,
  };
}
