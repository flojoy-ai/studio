import { TestSequenceElement } from "@/renderer/types/test-sequencer";
import { toast } from "sonner";
import { z } from "zod";

export const stringifyTestSet = (elems: TestSequenceElement[]): string => {
  const elemsString = JSON.stringify(elems);
  return elemsString;
};

// in the future, validate this!
export const readJsonTestSet = (
  elemsStr: string,
): TestSequenceElement[] | null => {
  try {
    const elems = z.array(TestSequenceElement).parse(JSON.parse(elemsStr));
    return elems;
  } catch (exception) {
    if (exception instanceof Error) {
      toast.error(exception.message);
    }
  }
  return null;
};
