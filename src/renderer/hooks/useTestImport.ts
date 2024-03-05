import { baseClient } from "@/renderer/lib/base-client";
import { Test, TestDiscoverContainer } from "@/renderer/types/testSequencer";
import { useTestSequencerState } from "./useTestSequencerState";
import { map } from "lodash";
import { v4 as uuidv4 } from "uuid";
import { ImportTestSettings } from "@/renderer/routes/test_sequencer_panel/components/ImportTestModal";
import { toast } from "sonner";
import { useCallback } from "react";
import { Dispatch, SetStateAction } from "react";
import { verifyElementCompatibleWithProject } from "@/renderer/utils/TestSequenceProjectHandler";

function parseDiscoverContainer(
  data: TestDiscoverContainer,
  settings: ImportTestSettings,
) {
  const { getPathSeparator } = window.api
  const sep = getPathSeparator();
  function escape(str: string) {
    if (sep === "\\") {
      return str.replaceAll('\\', '/');
    }
    return str;
  }
  return map(data.response, (container) => {
    const new_elem: Test = {
      ...container,
      path: escape(container.path),
      testName: escape(container.testName),
      type: "test",
      id: uuidv4(),
      groupId: uuidv4(),
      runInParallel: false,
      testType: settings.importType,
      status: "pending",
      completionTime: undefined,
      isSavedToCloud: false,
      error: null,
    };
    return new_elem;
  });
}

export const useTestImport = () => {
  const { setElems, project } = useTestSequencerState();

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
    if (settings.importType == "Python") {
      data = {
        response: [{ testName: path, path: path }],
        missingLibraries: [],
      };
    } else {
      const response = await baseClient.get("discover-pytest", {
        params: {
          path: path,
          oneFile: settings.importAsOneRef,
        },
      });
      data = JSON.parse(response.data);
    }
    for (const lib of data.missingLibraries) {
      toast.error(`Missing Python Library: ${lib}`, {
        action: {
          label: "Install",
          onClick: (_) => {
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
    if (project !== null) {
      const result = await verifyElementCompatibleWithProject(project, newElems, false);
      if (!result.ok) {
        toast.error(`${result.error}`);
        return
      }
    }
    setModalOpen(false);
    setElems((elems) => {
      return [...elems, ...newElems];
    });
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
