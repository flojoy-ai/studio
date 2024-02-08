import { TestSequenceElement } from "@/renderer/types/testSequencer";

export type validator = (param: TestSequenceElement[]) => boolean;

export const validateStructure: validator = (elems) => {
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
          if (
            conditional_stack.length == 0 ||
            conditional_stack.at(-1) !== elem.groupId
          )
            return false;
          conditional_stack.pop();
          break;
      }
    }
  }
  console.log("valid");
  return true;
};
