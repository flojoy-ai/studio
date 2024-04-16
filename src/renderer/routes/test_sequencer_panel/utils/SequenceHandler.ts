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
import { err, ok, Result } from "neverthrow";

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
): Promise<Result<void, Error>> {
  // Create a new project from the element currently in the test sequencer
  // - Will valide that each element is in the base folder
  const elems = stateManager.elems;
  sequence = validatePath(sequence);
  const result =
    await createExportableSequenceElementsFromTestSequencerElements(
      elems,
      sequence.projectPath,
    );
  if (result.isErr()) {
    return err(result.error);
  }
  sequence = updateSequenceElement(sequence, result.value);
  const res = await saveToDisk(sequence);
  if (res.isErr()) {
    return err(res.error);
  }
  await syncSequence(sequence, stateManager);
  return ok(undefined);
}

export async function saveSequence(
  stateManager: StateManager,
): Promise<Result<void, Error>> {
  // Save the current sequence to disk
  let sequence = stateManager.project;
  if (sequence === null) {
    return err(Error("No sequence to save"));
  }
  const elems = stateManager.elems;
  sequence = validatePath(sequence);
  const exportableElems =
    await createExportableSequenceElementsFromTestSequencerElements(
      elems,
      sequence.projectPath,
    );
  if (exportableElems.isErr()) {
    return err(exportableElems.error);
  }
  sequence = updateSequenceElement(sequence, exportableElems.value);
  const res = await saveToDisk(sequence);
  if (res.isErr()) {
    return err(res.error);
  }
  const isSync = await syncSequence(sequence, stateManager);
  if (isSync.isErr()) {
    return isSync;
  }
  return ok(undefined);
}

export async function saveSequences(
  stateManager: StateManager,
): Promise<Result<void, Error>> {
  // Save the current sequence to disk
  const containers = stateManager.sequences;
  if (containers.length === 0) {
    return err(Error("No sequences to save"));
  }
  containers.forEach(async (ctn) => {
    const elems = ctn.elements;
    let sequence = ctn.project;
    sequence = validatePath(sequence);
    const result =
      await createExportableSequenceElementsFromTestSequencerElements(
        elems,
        sequence.projectPath,
      );
    if (result.isErr()) {
      return result;
    }
    sequence = updateSequenceElement(sequence, result.value);
    const res = await saveToDisk(sequence);
    if (res.isErr()) {
      return err(res.error);
    }
  });
  return ok(undefined);
}

export async function importSequence(
  filePath: string,
  fileContent: string,
  stateManager: StateManager,
  skipImportDeps: boolean = false,
): Promise<Result<void, Error>> {
  // From a file, import a sequence and update the test sequencer
  // * Importing a sequence overwrites the current sequence, even the test sequencer is unsaved
  let sequence = readJsonSequence(fileContent);
  if (!sequence) {
    return err(Error("Error reading sequence file"));
  }
  const sequencePath = filePath.replaceAll(sequence.name + ".tjoy", "");
  sequence = updatePath(sequence, sequencePath);
  if (!skipImportDeps) {
    const success = await installDeps(sequence);
    if (!success) {
      return err(Error("Not able to installing dependencies"));
    }
  }
  await syncSequence(sequence, stateManager);
  return ok(undefined);
}

export async function exportSequence(
  stateManager: StateManager,
): Promise<Result<void, Error>> {
  // Export the current sequence as a zip file without any dependencies
  await saveSequence(stateManager);
  const error = new Error("Export Not Implemented");
  return err(error);
}

export async function closeSequence(
  stateManager: StateManager,
): Promise<Result<void, Error>> {
  // Close the current proejct from the app. The sequence is NOT deleted from disk
  if (stateManager.project !== null) {
    stateManager.removeSequence(stateManager.project.name);
  }
  return ok(undefined);
}

export async function verifyElementCompatibleWithSequence(
  sequence: TestSequencerProject,
  elements: TestSequenceElement[],
): Promise<Result<void, Error>> {
  // Verify that the elements are within the current sequence directory.
  return await checkIfAllInBaseFolder(elements, sequence.projectPath);
}

// Private -------------------------------------------------------------------------------------------------

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

async function saveToDisk(
  sequence: TestSequencerProject,
): Promise<Result<void, Error>> {
  // Deps
  if (sequence.interpreter.requirementsPath) {
    const deps = await window.api.poetryShowUserGroup();
    const content = deps.map((dep) => dep.name + "==" + dep.version).join("\n");
    const didSave = await window.api.saveFileToDisk(
      sequence.projectPath + sequence.interpreter.requirementsPath,
      content,
    );
    if (!didSave) {
      return err(Error(`Failed to save file to ${sequence.projectPath}`));
    }
  }
  // Sequence
  const didSave = await window.api.saveFileToDisk(
    sequence.projectPath + sequence.name + ".tjoy",
    stringifySequence(sequence),
  );
  if (!didSave) {
    return err(Error(`Failed to save file to ${sequence.projectPath}`));
  } else {
    return ok(undefined);
  }
}

async function installDeps(sequence: TestSequencerProject): Promise<boolean> {
  const success = await window.api.poetryInstallRequirementsUserGroup(
    sequence.projectPath + sequence.interpreter.requirementsPath,
  );
  return success;
}

async function syncSequence(
  sequence: TestSequencerProject,
  stateManager: StateManager,
): Promise<Result<void, Error>> {
  const elements = await createTestSequencerElementsFromSequenceElements(
    sequence,
    sequence.projectPath,
    false,
  );
  if (elements.isErr()) {
    return err(elements.error);
  }
  stateManager.addNewSequence(sequence, elements.value);
  return ok(undefined);
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
): Promise<Result<TestSequenceElement[], Error>> {
  const result = await checkIfAllInBaseFolder(elems, baseFolder);
  if (result.isErr()) {
    return err(result.error);
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
          elem.minValue,
          elem.maxValue,
          elem.unit,
        )
      : {
          ...elem,
          condition: elem.condition.replaceAll(baseFolder, ""),
        };
  });
  return ok(elements);
}

async function createTestSequencerElementsFromSequenceElements(
  sequence: TestSequencerProject,
  baseFolder: string,
  verifState: boolean,
): Promise<Result<TestSequenceElement[], Error>> {
  const elements: TestSequenceElement[] = [...sequence.elems].map((elem) => {
    return elem.type === "test"
      ? createNewTest(
          removeBaseFolderFromName(elem.testName, baseFolder),
          baseFolder + elem.path,
          elem.testType,
          elem.exportToCloud,
          elem.id,
          elem.groupId,
          elem.minValue,
          elem.maxValue,
          elem.unit,
        )
      : {
          ...elem,
        };
  });
  sequence.elems = elements;
  if (verifState) {
    const result = await checkIfAllInBaseFolder(elements, baseFolder);
    if (result.isErr()) {
      return err(result.error);
    }
  }
  return ok(elements);
}

async function checkIfAllInBaseFolder(
  elems: TestSequenceElement[],
  baseFolder: string,
): Promise<Result<void, Error>> {
  for (const elem of elems) {
    let weGoodBro = false;
    if (elem.type === "conditional") {
      continue;
    }
    if (elem.path.startsWith(baseFolder)) {
      // Absolute path
      continue;
    }
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
        return err(Error(`Error while checking if the file is on disk`));
      });
    // New test type ? Handle it here
    if (!weGoodBro) {
      return err(
        Error(
          `The element ${elem.path} is not in the base folder ${baseFolder}`,
        ),
      );
    }
  }
  return ok(undefined);
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
