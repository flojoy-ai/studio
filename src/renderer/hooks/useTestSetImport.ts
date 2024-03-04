import { useTestSequencerState } from "@/renderer/hooks/useTestSequencerState";
import { TestSequenceElement } from "@/renderer/types/test-sequencer";
import { z } from "zod";

export const useTestSetImport = () => {
  const { setElems } = useTestSequencerState();

  const openFilePicker = () => {
    window.api
      .openFilePicker(["tjoy"])
      .then((result) => {
        if (!result) return;
        const { fileContent } = result;
        const elems = z
          .array(TestSequenceElement)
          .parse(JSON.parse(fileContent));

        setElems(elems);
      })
      .catch((errors) => {
        console.error("Errors when trying to load file: ", errors);
      });
  };

  return openFilePicker;
};
