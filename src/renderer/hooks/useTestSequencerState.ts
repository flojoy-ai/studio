import { atom, useAtom } from "jotai";
import {
  Conditional,
  Test,
  TestSequenceElement,
  TestRootNode,
  TestSequenceElementNode,
  IfNode,
  TestNode,
  MsgState,
  TestSequencerProject,
} from "@/renderer/types/testSequencer";
import { atomWithImmer } from "jotai-immer";
import { v4 as uuidv4 } from "uuid";
import {
  checkUniqueNames,
  validateStructure,
  validator,
} from "@/renderer/utils/TestSequenceValidator";
import useWithPermission from "./useWithPermission";

export const testSequenceTree = atom<TestRootNode>({
  type: "root",
  children: [],
  identifiers: [],
});

export const curRun = atom<string[]>([]);

export const websocketIdAtom = atom<string>(uuidv4());

export const elements = atomWithImmer<(Test | Conditional)[]>([]);

export const isLockedAtom = atomWithImmer<boolean>(false);

export const isLoadingAtom = atomWithImmer<boolean>(true);

export const backendStateAtom = atomWithImmer<MsgState>("TEST_SET_DONE");

export const testSequenceUnsaved = atomWithImmer<boolean>(false);

export const testSequencerProjectAtom = atomWithImmer<TestSequencerProject | null>(null);

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

export function useTestSequencerState() {
  const [elems, setElements] = useAtom(elements);
  const [websocketId] = useAtom(websocketIdAtom);
  const [tree, setTree] = useAtom(testSequenceTree);
  const [running, setRunning] = useAtom(curRun);
  const [isLoading, setIsLoading] = useAtom(isLoadingAtom);
  const [isLocked, setIsLocked] = useAtom(isLockedAtom); // this is used to lock the UI while the test is running
  const [backendState, setBackendState] = useAtom(backendStateAtom);
  const [isUnsaved, setUnsaved] = useAtom(testSequenceUnsaved);
  const [project, setProject] = useAtom(testSequencerProjectAtom);
  const { withPermissionCheck } = useWithPermission();

  // wrapper around setElements to check if elems is valid
  function setElems(elems: TestSequenceElement[]);
  function setElems(
    fn: (elems: TestSequenceElement[]) => TestSequenceElement[],
  );
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  function setElems(p: any) {
    let candidateElems: TestSequenceElement[];

    //handle overloads
    if (Array.isArray(p)) {
      candidateElems = p;
    } else {
      candidateElems = p(elems);
    }

    //validate new elements
    const res = validateElements(
      [validateStructure, checkUniqueNames],
      candidateElems,
    );
    if (!res) {
      console.error("Validation failed");
      return;
    }

    //PASS
    setElements(candidateElems);
    setUnsaved(true);

    /* _________________________ */

    //creates tree to send to backend
    setTree(createTestSequenceTree(candidateElems));
  }
  const setElemsWithPermissions = withPermissionCheck(setElems);

  return {
    elems,
    websocketId,
    setElems: setElemsWithPermissions,
    tree,
    running,
    setRunning,
    setIsLocked,
    setBackendState,
    isLocked,
    isLoading,
    backendState,
    setIsLoading,
    setUnsaved,
    isUnsaved,
    project,
    setProject
  };
}
