import { TestSequenceElement } from "@/renderer/types/testSequencer";
import { toast } from "sonner";

export const stringifyTestSet = (elems: TestSequenceElement[]): string => {
  const elemsString = JSON.stringify(elems);
  return elemsString;
};

// in the future, validate this!
export const readJsonTestSet = (
  elemsStr: string,
): TestSequenceElement[] | null => {
  try {
    const elems: TestSequenceElement[] = JSON.parse(elemsStr);
    return elems;
  } catch (exception) {
    if (exception instanceof Error) {
      toast.error(exception.message);
    }
  }
  return null;
};
