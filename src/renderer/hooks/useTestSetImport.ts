import { useTestSequencerState } from "./useTestSequencerState";

export const useTestSetImport = () => {
  const { setElems } = useTestSequencerState();

  const openFilePicker = () => {
    window.api
      .openFilePicker(["tjoy"])
      .then((result) => {
        if (!result) return;
        const { fileContent } = result;
        const elems = JSON.parse(fileContent);
        setElems(elems);
      })
      .catch((errors) => {
        console.error("Errors when trying to load file: ", errors);
      });
  };

  return openFilePicker;
};
