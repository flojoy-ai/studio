import {
  ConditionalComponent,
  Conditional,
  TestSequenceElement,
} from "@/renderer/types/testSequencer";
import { v4 as uuidv4 } from "uuid";
import { filter } from "lodash";
import { SetElemsFn } from "@/renderer/hooks/useTestSequencerState";

const mapToConditionals: { [key: string]: Conditional[] } = {
  if: [
    {
      type: "conditional",
      id: uuidv4(),
      role: "start",
      groupId: "",
      conditionalType: "if",
      condition: "",
    },
    {
      type: "conditional",
      id: uuidv4(),
      role: "between",
      groupId: "",
      conditionalType: "else",
      condition: "",
    },
    {
      type: "conditional",
      id: uuidv4(),
      role: "end",
      groupId: "",
      conditionalType: "end",
      condition: "",
    },
  ],
};

/**
 * Generates proper conditional elements in sequencer.
 * For example, if "if" conditional requested, will generate also "end" element
 * @param {ConditionalComponent} type - The type of conditional the user requested
 * */
export const generateConditional: {
  (type: ConditionalComponent): Conditional[];
} = (type: ConditionalComponent) => {
  const groupId = uuidv4();
  return mapToConditionals[type].map((conditional) => {
    return { ...conditional, groupId: groupId };
  });
};

/**
 * Handles deletion of a conditional, since it will usually imply multiple deletes.
 * For example, deleting an "if" also implies deleting any "else", "else if" and "end" associated with it.
 * @param {Conditional} conditional - The conditional to be deleted
 */
export const handleConditionalDelete = (
  conditional: Conditional,
  setter: SetElemsFn,
): void => {
  setter((elems) =>
    filter(elems, (elem) => elem.groupId != conditional.groupId),
  );
};

/*
 * Creates an array of indent count for each row to properly show conditional logic to user.
 * Elems here is guaranteed to be valid.
 * @param {TestSequenceElement[]} elems - The current test sequence elements
 */
export const getIndentLevels = (elems: TestSequenceElement[]) => {
  let indentCount = 0;
  return elems.map((elem) => {
    if (elem.type === "conditional") {
      switch (elem.role) {
        case "start":
          indentCount += 1;
          return indentCount - 1;
        case "between":
          return indentCount - 1;
        case "end":
          indentCount -= 1;
          return indentCount;
      }
    }
    return indentCount;
  });
};
