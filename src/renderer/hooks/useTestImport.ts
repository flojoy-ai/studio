import { Test, TestDiscoverContainer } from "@/renderer/types/test-sequencer";
import { createNewTest, useTestSequencerState } from "./useTestSequencerState";
import { map } from "lodash";
import { v4 as uuidv4 } from "uuid";
import { ImportTestSettings } from "@/renderer/routes/test_sequencer_panel/components/ImportTestModal";
import { toast } from "sonner";
import { useCallback } from "react";
import { Dispatch, SetStateAction } from "react";
import { verifyElementCompatibleWithProject } from "@/renderer/utils/TestSequenceProjectHandler";
import { discoverPytest } from "@/renderer/lib/api";
import { toastQueryError } from "@/renderer/utils/report-error";

function parseDiscoverContainer(
  data: TestDiscoverContainer,
  settings: ImportTestSettings,
) {
  return map(data.response, (container) => {
    const new_elem = createNewTest(
      container.testName,
      container.path,
      settings.importType,
    );
    return new_elem;
  });
}

export const useTestImport = () => {
  const { project, AddNewElems } = useTestSequencerState();

  const handleUserDepInstall = useCallback(async (depName: string) => {
    const promise = () => window.api.poetryInstallDepUserGroup(depName);
    toast.promise(promise, {
      loading: `Installing ${depName}...`,
      success: () => {
        return `${depName} has been added.`;
      },
      error:
        "Could not install the library. Please consult the Dependency Manager in the settings.",
    });
  }, []);

  async function getTests(
    path: string,
    settings: ImportTestSettings,
    setModalOpen: Dispatch<SetStateAction<boolean>>,
  ) {
    let data: TestDiscoverContainer;
    if (settings.importType == "python") {
      data = {
        response: [{ testName: path, path: path }],
        missingLibraries: [],
      };
    } else {
      const res = await discoverPytest(path, settings.importAsOneRef);
      if (res.isErr()) {
        toastQueryError(res.error, "Error while trying to discover tests");
        return;
      }
      data = res.value;
    }
    for (const lib of data.missingLibraries) {
      toast.error(`Missing Python Library: ${lib}`, {
        action: {
          label: "Install",
          onClick: () => {
            handleUserDepInstall(lib);
          },
        },
      });
    }
    if (data.missingLibraries && data.missingLibraries.length > 0) {
      throw new Error("Missing Libraries");
    }
    const newElems = parseDiscoverContainer(data, settings);
    if (newElems.length === 0) {
      toast.error("No tests found in the specified file.");
      throw new Error("No tests found in the file");
    }
    const result = await AddNewElems(newElems);
    if (result.isErr()) {
      toast.error(`${result.error}`);
      return;
    }
    setModalOpen(false);
  }

  const openFilePicker = (
    settings: ImportTestSettings,
    setModalOpen: Dispatch<SetStateAction<boolean>>,
  ) => {
    window.api
      .openTestPicker()
      .then((result) => {
        if (!result) return;
        const { filePath } = result;
        getTests(filePath, settings, setModalOpen);
      })
      .catch((error) => {
        console.error("Errors when trying to load file: ", error);
      });
  };

  return openFilePicker;
};
