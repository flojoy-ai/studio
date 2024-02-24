import { baseClient } from "@/renderer/lib/base-client";
import { Test, TestDiscoverContainer } from "@/renderer/types/testSequencer";
import { useTestSequencerState } from "./useTestSequencerState";
import { map } from "lodash";
import { v4 as uuidv4 } from "uuid";
import { ImportTestSettings } from "@/renderer/routes/test_sequencer_panel/components/ImportTestModal";
import { toast } from "sonner";
import { useCallback } from "react";
import { Dispatch, SetStateAction, useState } from "react";
import { TestSequenceEvents } from "../routes/test_sequencer_panel/models/models";

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

  const handleUserDepInstall = useCallback(async (depName: string) => {
    const promise = () => window.api.poetryInstallDep(depName);
    toast.promise(promise, {
      loading: `Installing ${depName}...`,
      success: () => {
        return `${depName} has been added.`;
      },
      error: 'Could not install the library. Please consult the Dependency Manager in the settings.'
    });
  }, []);

  async function getTests(path: string, settings: ImportTestSettings, setModalOpen: Dispatch<SetStateAction<boolean>>) {
    const response = await baseClient.get("discover-pytest", {
      params: {
        path: path,
        oneFile: settings.importAsOneRef,
      },
    });
    const data: TestDiscoverContainer = JSON.parse(response.data);
    for (const lib of data.missingLibraries) {
      toast.error(`Missing Python Library: ${lib}`, {
        action: {
          label: 'Install',
          onClick: (_) => { handleUserDepInstall(lib); }
        },
      })
    }
    if (data.missingLibraries && data.missingLibraries.length > 0) {
      throw new Error("Missing Libraries");
    }
    const newElems = parseDiscoverContainer(data);
    if (newElems.length === 0) {
      toast.error("No tests found in the specified file.");
      throw new Error("No tests found in the file");
    }
    setModalOpen(false);
    setElems((elems) => {
      return [...elems, ...newElems];
    });
  }

  const openFilePicker = (settings: ImportTestSettings, setModalOpen: Dispatch<SetStateAction<boolean>>) => {
    window.api
      .openTestPicker()
      .then((result) => {
        if (!result) return;
        const { filePath } = result;
        getTests(filePath, settings, setModalOpen)
      })
      .catch((error) => {
        console.error("Errors when trying to load file: ", error);
      });
  };

  return openFilePicker;
};

