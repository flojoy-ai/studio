// Exposed function in this file should alway follow the following pattern:
// Take the sequence as an Input.
//   1. Always valide the state of the sequence
//   2. Do the operation
//   3. Update the test sequencer
//   4. Return a Result<T, Error>
// Note: All path in a sequence should be using '/' for cross-platform compatibility

import {
  readJsonSequence,
  stringifySequence,
} from "@/renderer/routes/test_sequencer_panel/utils/TestSetUtils";
import {
  TestSequenceContainer,
  TestSequenceElement,
  TestSequencerProject,
} from "@/renderer/types/test-sequencer";
import { createNewTest } from "@/renderer/hooks/useTestSequencerState";
import { Err, Ok, Result } from "neverthrow";

// Exposed API
export type StateManager = {
  elems: TestSequenceElement[];
  addNewSequence: (
    project: TestSequencerProject,
    elements: TestSequenceElement[],
  ) => void;
  removeSequence: (name: string) => void;
  project: TestSequencerProject | null;
  sequences: TestSequenceContainer[];
};

export async function createSequence(
  sequence: TestSequencerProject,
  stateManager: StateManager,
  throwInsteadOfResult: boolean = false,
): Promise<Result<void, Error>> {
  // Create a new project from the element currently in the test sequencer
  // - Will valide that each element is in the base folder
  try {
    const elems = stateManager.elems;
    sequence = validatePath(sequence);
    sequence = updateSequenceElement(
      sequence,
      await createExportableSequenceElementsFromTestSequencerElements(
        elems,
        sequence.projectPath,
        true,
      ),
    );
    await saveToDisk(sequence);
    await syncSequence(sequence, stateManager);
    return new Ok(undefined);
  } catch (e: unknown) {
    if (throwInsteadOfResult) throw e;
    return buildResultFromCatch(e);
  }
}

export async function saveSequence(
  stateManager: StateManager,
  throwInsteadOfResult: boolean = false,
): Promise<Result<void, Error>> {
  // Save the current sequence to disk
  try {
    let sequence = stateManager.project;
    if (sequence === null) {
      throw new Error("No sequence to save");
    }
    const elems = stateManager.elems;
    sequence = validatePath(sequence);
    sequence = updateSequenceElement(
      sequence,
      await createExportableSequenceElementsFromTestSequencerElements(
        elems,
        sequence.projectPath,
        true,
      ),
    );
    await saveToDisk(sequence);
    await syncSequence(sequence, stateManager);
    return new Ok(undefined);
  } catch (e: unknown) {
    if (throwInsteadOfResult) throw e;
    return buildResultFromCatch(e);
  }
}

export async function saveSequences(
  stateManager: StateManager,
  throwInsteadOfResult: boolean = false,
): Promise<Result<void, Error>> {
  // Save the current sequence to disk
  try {
    const containers = stateManager.sequences;
    if (containers.length === 0) {
      throw new Error("No sequences to save");
    }
    containers.forEach(async (ctn) => {
      const elems = ctn.elements;
      let sequence = ctn.project;
      sequence = validatePath(sequence);
      sequence = updateSequenceElement(
        sequence,
        await createExportableSequenceElementsFromTestSequencerElements(
          elems,
          sequence.projectPath,
          true,
        ),
      );
      await saveToDisk(sequence);
    });
    return new Ok(undefined);
  } catch (e: unknown) {
    if (throwInsteadOfResult) throw e;
    return buildResultFromCatch(e);
  }
}

export async function importSequence(
  filePath: string,
  fileContent: string,
  stateManager: StateManager,
  throwInsteadOfResult: boolean = false,
  skipImportDeps: boolean = false,
): Promise<Result<void, Error>> {
  // From a file, import a sequence and update the test sequencer
  // * Importing a sequence overwrites the current sequence, even the test sequencer is unsaved
  try {
    let sequence = readJsonSequence(fileContent);
    if (!sequence) {
      throw new Error("Error reading sequence file");
    }
    const sequencePath = filePath.replaceAll(sequence.name + ".tjoy", "");
    sequence = updatePath(sequence, sequencePath);
    if (!skipImportDeps) {
      const success = await installDeps(sequence);
      if (!success) {
        throw Error("Not able to installing dependencies");
      }
    }
    await syncSequence(sequence, stateManager);
    return new Ok(undefined);
  } catch (e: unknown) {
    if (throwInsteadOfResult) throw e;
    return buildResultFromCatch(e);
  }
}

export async function exportSequence(
  stateManager: StateManager,
  throwInsteadOfResult: boolean = false,
): Promise<Result<void, Error>> {
  // Export the current sequence as a zip file without any dependencies
  await saveSequence(stateManager);
  const error = new Error("Export Not Implemented");
  if (throwInsteadOfResult) throw error;
  return new Err(error);
}

export async function closeSequence(
  stateManager: StateManager,
): Promise<Result<void, Error>> {
  // Close the current proejct from the app. The sequence is NOT deleted from disk
  if (stateManager.project !== null) {
    stateManager.removeSequence(stateManager.project.name);
  }
  return new Ok(undefined);
}

export async function verifyElementCompatibleWithSequence(
  sequence: TestSequencerProject,
  elements: TestSequenceElement[],
  throwInsteadOfResult: boolean = false,
): Promise<Result<void, Error>> {
  // Verify that the elements are within the current sequence directory.
  try {
    await throwIfNotInAllBaseFolder(elements, sequence.projectPath);
    return new Ok(undefined);
  } catch (e: unknown) {
    if (throwInsteadOfResult) throw e;
    return buildResultFromCatch(e);
  }
}

// Private -------------------------------------------------------------------------------------------------

function buildResultFromCatch(e: unknown): Result<void, Error> {
  if (e instanceof Error) {
    return new Err(e);
  } else {
    console.error("[Save Sequence] Unknown error", e);
    return new Err(new Error("Unknown error while creating the sequence."));
  }
}

function validatePath(sequence: TestSequencerProject): TestSequencerProject {
  let path = sequence.projectPath;
  if (!path.endsWith("/")) {
    path = path + "/";
  }
  return updatePath(sequence, path);
}

function updatePath(
  sequence: TestSequencerProject,
  newPath: string,
): TestSequencerProject {
  return {
    ...sequence,
    projectPath: newPath,
  };
}

async function saveToDisk(sequence: TestSequencerProject): Promise<void> {
  if ("api" in window) {
    // Deps
    if (sequence.interpreter.requirementsPath) {
      const deps = await window.api.poetryShowUserGroup();
      const content = deps
        .map((dep) => dep.name + "==" + dep.version)
        .join("\n");
      await window.api.saveToFile(
        sequence.projectPath + sequence.interpreter.requirementsPath,
        content,
      );
    }
    // Sequence
    await window.api.saveToFile(
      sequence.projectPath + sequence.name + ".tjoy",
      stringifySequence(sequence),
    );
  } else {
    throw new Error("Not able to save to disk");
  }
}

async function installDeps(sequence: TestSequencerProject): Promise<boolean> {
  if ("api" in window) {
    const succes = await window.api.poetryInstallRequirementsUserGroup(
      sequence.projectPath + sequence.interpreter.requirementsPath,
    );
    return succes;
  } else {
    throw new Error("Not able to install requirements."); // TODO: Better error
  }
}

async function syncSequence(
  sequence: TestSequencerProject,
  stateManager: StateManager,
): Promise<void> {
  const elements = await createTestSequencerElementsFromSequenceElements(
    sequence,
    sequence.projectPath,
    false,
  );
  stateManager.addNewSequence(sequence, elements);
}

function removeBaseFolderFromName(name: string, baseFolder: string): string {
  if (name.startsWith(baseFolder)) {
    return name.replace(baseFolder, "");
  }
  // Pytest have only part of the "path" in the name
  const splitName = name.split("/");
  const splitBase = new Set(baseFolder.split("/"));
  const filtered = splitName.filter((el) => !splitBase.has(el));
  return filtered.join("/");
}

async function createExportableSequenceElementsFromTestSequencerElements(
  elems: TestSequenceElement[],
  baseFolder: string,
  verifStateOrThrow: boolean,
): Promise<TestSequenceElement[]> {
  if (verifStateOrThrow) {
    await throwIfNotInAllBaseFolder(elems, baseFolder);
  }
  const elements = [...elems].map((elem) => {
    return elem.type === "test"
      ? createNewTest(
          removeBaseFolderFromName(elem.testName, baseFolder),
          elem.path.replaceAll(baseFolder, ""),
          elem.testType,
          elem.exportToCloud,
          elem.id,
          elem.groupId,
        )
      : {
          ...elem,
          condition: elem.condition.replaceAll(baseFolder, ""),
        };
  });
  return elements;
}

async function createTestSequencerElementsFromSequenceElements(
  sequence: TestSequencerProject,
  baseFolder: string,
  verifStateOrThrow: boolean,
): Promise<TestSequenceElement[]> {
  const elements: TestSequenceElement[] = [...sequence.elems].map((elem) => {
    return elem.type === "test"
      ? createNewTest(
          removeBaseFolderFromName(elem.testName, baseFolder),
          baseFolder + elem.path,
          elem.testType,
          elem.exportToCloud,
          elem.id,
          elem.groupId,
        )
      : {
          ...elem,
        };
  });
  sequence.elems = elements;
  if (verifStateOrThrow) {
    await throwIfNotInAllBaseFolder(elements, baseFolder);
  }
  return elements;
}

async function throwIfNotInAllBaseFolder(
  elems: TestSequenceElement[],
  baseFolder: string,
) {
  for (const elem of elems) {
    let weGoodBro = false;
    if (elem.type === "conditional") {
      continue;
    }
    if (elem.path.startsWith(baseFolder)) {
      // Absolute path
      continue;
    }
    if ("api" in window) {
      // Relative path
      await window.api
        .isFileOnDisk(baseFolder + elem.path)
        .then((result) => {
          if (result) {
            weGoodBro = true;
          }
        })
        .catch((e) => {
          console.error("Error while checking if file is on disk", e);
          throw new Error(`Error while checking if the file is on disk`);
        });
    }
    // New test type ? Handle it here
    if (!weGoodBro) {
      throw new Error(
        `The element ${elem.path} is not in the base folder ${baseFolder}`,
      );
    }
  }
}

function updateSequenceElement(
  sequence: TestSequencerProject,
  elements: TestSequenceElement[],
): TestSequencerProject {
  return {
    ...sequence,
    elems: elements,
  };
}
