import { atom, useAtom } from "jotai";
import {
  Conditional,
  Test,
  TestSequenceElement,
  RootNode,
  TestSequenceElementNode,
  IfNode,
  TestNode,
} from "@src/types/testSequencer";
import { atomWithImmer } from "jotai-immer";
import { useRef } from "react";
import { v4 as uuidv4 } from "uuid";

export const testSequenceTree = atom<RootNode>({} as RootNode);

export const websocketIdAtom = atom<string>(uuidv4());

export const elements = atomWithImmer<(Test | Conditional)[]>([
  {
    type: "test",
    id: "m5gr84i9",
    path: ".",
    test_name: "test_voltage.py",
    run_in_parallel: false,
    test_type: "Python",
    status: "pass",
    completion_time: 1,
    is_saved_to_cloud: true,
  },
  {
    type: "test",
    id: "iqyubqCHB",
    path: ".",
    test_name: "measure_width.json",
    run_in_parallel: false,
    test_type: "Flojoy",
    status: "failed",
    completion_time: 3,
    is_saved_to_cloud: true,
  },
  {
    type: "test",
    id: "aiubv123uajksc",
    path: ".",
    test_name: "measure_height.json",
    run_in_parallel: false,
    test_type: "Flojoy",
    status: "pass",
    completion_time: 3.2,
    is_saved_to_cloud: false,
  },
  {
    type: "test",
    id: "ashd21319DBASA",
    path: ".",
    test_name: "cap_vs_freq.m",
    run_in_parallel: true,
    test_type: "Matlab",
    status: "pass",
    completion_time: 4,
    is_saved_to_cloud: true,
  },
]);

const validateElements = (elems: TestSequenceElement[]): boolean => {
  const conditional_stack: string[] = [];
  for (let i = 0; i < elems.length; i++) {
    const elem = elems[i];
    if (elem.type === "conditional") {
      switch (elem.role) {
        case "start":
          conditional_stack.push(elem.groupId);
          break;
        case "between":
          if (
            conditional_stack.length == 0 ||
            conditional_stack.at(-1) !== elem.groupId
          )
            return false;
          break;
        case "end":
          if (conditional_stack.at(-1) !== elem.groupId) return false;
          conditional_stack.pop();
          break;
      }
    }
  }
  return true;
};

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
const createTestSequenceTree = (elems: TestSequenceElement[]): RootNode => {
  const root = { type: "root", children: [] } as RootNode;
  const stack: TestSequenceElementNode[][] = [root.children];
  for (let i = 0; i < elems.length; i++) {
    const curElem = elems[i];

    //handle non-leaf nodes
    if (curElem.type === "conditional") {
      switch (curElem.conditional_type) {
        case "if":
          const ifNode = {
            ...curElem,
            main: [],
            else: [],
          } as IfNode;
          stack.at(-1).push(ifNode);
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
    stack.at(-1).push(testNode);
  }
  return root;
};

export function useTestSequencerState() {
  const [elems, setElements] = useAtom(elements);
  const [websocketId] = useAtom(websocketIdAtom);
  const [tree, setTree] = useAtom(testSequenceTree);

  // wrapper around setElements to check if elems is valid
  function setElems(elems: TestSequenceElement[]);
  function setElems(
    fn: (elems: TestSequenceElement[]) => TestSequenceElement[],
  );
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  function setElems(p: any) {
    let candidateElems;

    //handle overloads
    if (Array.isArray(p)) {
      candidateElems = p;
    } else if (typeof p === "function") {
      candidateElems = p(elems);
    }

    //validate new elements
    if (!validateElements(candidateElems)) {
      setElements(prevElems.current);
      return;
    }

    //PASS
    prevElems.current = candidateElems;
    setElements(candidateElems);

    /* _________________________ */

    //creates tree to send to backend
    const root = createTestSequenceTree(candidateElems);
    setTree(root);
  }

  const prevElems = useRef(elems);
  return {
    elems,
    setElems,
    websocketId,
  };
}
