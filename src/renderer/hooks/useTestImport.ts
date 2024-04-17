import { TestDiscoverContainer, TestSequenceElement } from "@/renderer/types/test-sequencer";
import {
  createNewTest,
  useDisplayedSequenceState,
} from "./useTestSequencerState";
import { map } from "lodash";
import { ImportTestSettings } from "@/renderer/routes/test_sequencer_panel/components/modals/ImportTestModal";
import { toast } from "sonner";
import { useCallback } from "react";
import { discoverPytest } from "@/renderer/lib/api";
import { useSequencerModalStore } from "../stores/modal";
import { toastResultPromise } from "../utils/report-error";
import { Result, err, ok } from "neverthrow";

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

export const useDiscoverAndImportTests = () => {
  const { addNewElems } = useDisplayedSequenceState();
  const { openErrorModal } = useSequencerModalStore();

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
  ): Promise<Result<void, Error>> {
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
        return err(res.error);
      }
      data = res.value;
    }
    if (data.error) {
      return err(Error(data.error));
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
      return err(Error("Please retry after installing the missing libraries."));
    }
    const newElems = parseDiscoverContainer(data, settings);
    if (newElems.length === 0) {
      return err(Error("No tests were found in the specified file."));
    }
    const result = await addNewElems(newElems);
    if (result.isErr()) {
      return err(result.error);
    }
    setModalOpen(false);
    return ok(undefined);
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
        toastResultPromise(getTests(filePath, settings, setModalOpen), {
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
                    openErrorModal(e.message);
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


export async function useDiscoverPytestElements() {

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
  ): Promise<Result<TestSequenceElement[], Error>> {
    let data: TestDiscoverContainer;
    const res = await discoverPytest(path, false);
    if (res.isErr()) {
      return err(res.error);
    }
    data = res.value;
    if (data.error) {
      return err(Error(data.error));
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
      return err(Error("Please retry after installing the missing libraries."));
    }
    const newElems = parseDiscoverContainer(data, { importAsOneRef: false, importType: "pytest" } );
    if (newElems.length === 0) {
      return err(Error("No tests were found in the specified file."));
    }
    return ok(newElems);
  }

  const openFilePicker = (): Promise<Result<TestSequenceElement[], Error>> => {
    return window.api.openTestPicker()
      .then(result => {
        if (!result) 
          return err(Error("No file selected."));
        toast.info("Importing tests...");
        const { filePath } = result;
        return getTests(filePath);
      });
  }

  return openFilePicker;

};

