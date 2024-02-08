import { baseClient } from "@/renderer/lib/base-client";
import { Test, TestDiscoverContainer } from "@/renderer/types/testSequencer";
import { useTestSequencerState } from "./useTestSequencerState";
import { map } from "lodash";
import { v4 as uuidv4 } from "uuid";
import { ImportTestSettings } from "@/renderer/routes/test_sequencer_panel/components/ImportTestModal";

function parseDiscoverContainer(data: TestDiscoverContainer) {
  return map(data.response, (container) => {
    const new_elem: Test = {
      ...container,
      type: "test",
      id: uuidv4(),
      groupId: uuidv4(),
      runInParallel: false,
      testType: "Python",
      status: "pending",
      completionTime: undefined,
      isSavedToCloud: false,
    };
    return new_elem;
  });
}

export const useTestImport = () => {
  const { setElems } = useTestSequencerState();

  async function getTests(path: string, settings: ImportTestSettings) {
    try {
      const response = await baseClient.get("discover-pytest", {
        params: {
          path: path,
          oneFile: settings.importAsOneRef,
        },
      });
      const data: TestDiscoverContainer = JSON.parse(response.data);
      console.log(data);
      const new_elems = parseDiscoverContainer(data);
      setElems((elems) => {
        return [...elems, ...new_elems];
      });
    } catch (error) {
      console.error(error);
    }
  }

  const openFilePicker = (settings: ImportTestSettings) => {
    window.api
      .openTestPicker()
      .then((result) => {
        if (!result) return;
        const { filePath } = result;
        getTests(filePath, settings);
      })
      .catch((errors) => {
        console.log("Errors when trying to load file: ", errors);
      });
  };

  return openFilePicker;
};
