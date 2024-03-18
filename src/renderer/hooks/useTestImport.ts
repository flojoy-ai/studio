import { TestDiscoverContainer } from "@/renderer/types/test-sequencer";
import { createNewTest, useTestSequencerState } from "./useTestSequencerState";
import { map } from "lodash";
import { ImportTestSettings } from "@/renderer/routes/test_sequencer_panel/components/modals/ImportTestModal";
import { toast } from "sonner";
import { useCallback } from "react";
import { discoverPytest } from "@/renderer/lib/api";
import { useModalStore } from "@/renderer/stores/modal";

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
  const { AddNewElems } = useTestSequencerState();
  const { setErrorModalMessage, setIsErrorModalOpen } = useModalStore();

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
    setModalOpen: (val: boolean) => void,
  ) {
    let data: TestDiscoverContainer;
    if (settings.importType == "python") {
      data = {
        response: [{ testName: path, path: path }],
        missingLibraries: [],
        error: null,
      };
    } else {
      const res = await discoverPytest(path, settings.importAsOneRef);
      if (res.isErr()) {
        throw res.error;
      }
      data = res.value;
    }
    if (data.error) {
      throw new Error(data.error);
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
      throw new Error("Please retry after installing the missing libraries.");
    }
    const newElems = parseDiscoverContainer(data, settings);
    if (newElems.length === 0) {
      throw new Error("No tests were found in the specified file.");
    }
    const result = await AddNewElems(newElems);
    if (result.isErr()) {
      throw result.error;
    }
    setModalOpen(false);
  }

  const openFilePicker = (
    settings: ImportTestSettings,
    setModalOpen: (val: boolean) => void,
  ) => {
    window.api
      .openTestPicker()
      .then((result) => {
        if (!result) return;
        const { filePath } = result;
        toast.promise(getTests(filePath, settings, setModalOpen), {
          loading: "Importing test...",
          success: () => {
            return "Test Imported.";
          },
          error: (e) => {
            // If message too long, open a Error modal instead (with the click of a button)
            if (e.message.length > 100) {
              toast("Error while attempting to discover tests", {
                action: {
                  label: "More details",
                  onClick: () => {
                    setErrorModalMessage(e.message);
                    setIsErrorModalOpen(true);
                  },
                },
              });
              return "Failed to discover tests due to an unexpected error.";
            }
            return `Error while attempting to discover tests: ${e.message.replace("Error: ", "")}`;
          },
        });
      })
      .catch((error) => {
        console.error("Errors when trying to load file: ", error);
      });
  };

  return openFilePicker;
};
