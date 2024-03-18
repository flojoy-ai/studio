// Exposed function in this file should alway follow the following pattern:
// Take the project as an Input.
//   1. Always valide the state of the proejct
//   2. Do the operation
//   3. Update the test sequencer
//   4. Return a Result<T, Error>
// Note: All path in a project should be using '/' for cross-platform compatibility

// Note: Toast.promise doesn't work with neverthrow -----
export type Result<T, E = Error> =
  | { ok: true; value: T }
  | { ok: false; error: E };

export function Ok<T, E>(value: T): Result<T, E> {
  return { ok: true, value };
}
export function Err<T, E>(error: E): Result<T, E> {
  return { ok: false, error };
}
// End of note ------------------------------------------

import {
  readJsonProject,
  stringifyProject,
} from "@/renderer/routes/test_sequencer_panel/utils/TestSetUtils";
import {
  TestSequenceElement,
  TestSequencerProject,
} from "@/renderer/types/test-sequencer";
import { createNewTest } from "@/renderer/hooks/useTestSequencerState";

// Exposed API
export type StateManager = {
  elem: TestSequenceElement[];
  setElems: (elems: TestSequenceElement[]) => void;
  project: TestSequencerProject | null;
  setProject: (project: TestSequencerProject | null) => void;
  setUnsaved: (unsaved: boolean) => void;
};

export async function createProject(
  project: TestSequencerProject,
  stateManager: StateManager,
  throwInsteadOfResult: boolean = false,
): Promise<Result<null, Error>> {
  // Create a new project from the element currently in the test sequencer
  // - Will valide that each element is in the base folder
  try {
    const elems = stateManager.elem;
    project = validatePath(project);
    console.log(project);
    project = updateProjectElements(
      project,
      await createProjectElementsFromTestSequencerElements(
        elems,
        project.projectPath,
        true,
      ),
    );
    await saveToDisk(project);
    await syncProject(project, stateManager);
    return Ok(null);
  } catch (e: unknown) {
    if (throwInsteadOfResult) throw e;
    return buildResultFromCatch(e);
  }
}

export async function saveProject(
  stateManager: StateManager,
  throwInsteadOfResult: boolean = false,
): Promise<Result<null, Error>> {
  // Save the current project to disk
  try {
    let project = stateManager.project;
    if (project === null) {
      throw new Error("No project to save");
    }
    const elems = stateManager.elem;
    project = validatePath(project);
    project = updateProjectElements(
      project,
      await createProjectElementsFromTestSequencerElements(
        elems,
        project.projectPath,
        true,
      ),
    );
    await saveToDisk(project);
    await syncProject(project, stateManager);
    return Ok(null);
  } catch (e: unknown) {
    if (throwInsteadOfResult) throw e;
    return buildResultFromCatch(e);
  }
}

export async function importProject(
  filePath: string,
  fileContent: string,
  stateManager: StateManager,
  throwInsteadOfResult: boolean = false,
): Promise<Result<null, Error>> {
  // From a file, import a project and update the test sequencer
  // * Importing a project overwrites the current project, even the test sequencer is unsaved
  try {
    let project = readJsonProject(fileContent);
    if (!project) {
      throw new Error("Error reading project file");
    }
    const projectPath = filePath.replaceAll(project.name + ".tjoy", "");
    project = updatePath(project, projectPath);
    const success = await installDeps(project);
    if (!success) {
      throw Error("Error installing dependencies");
    }
    await syncProject(project, stateManager);
    return Ok(null);
  } catch (e: unknown) {
    if (throwInsteadOfResult) throw e;
    return buildResultFromCatch(e);
  }
}

export async function exportProject(
  stateManager: StateManager,
  throwInsteadOfResult: boolean = false,
): Promise<Result<null, Error>> {
  // Export the current project as a zip file without any dependencies
  await saveProject(stateManager);
  const error = new Error("Export Not Implemented");
  if (throwInsteadOfResult) throw error;
  return Err(error);
}

export async function closeProject(
  stateManager: StateManager,
): Promise<Result<null, Error>> {
  // Close the current proejct from the app. The project is NOT deleted from disk
  stateManager.setProject(null);
  return Ok(null);
}

export async function verifyElementCompatibleWithProject(
  project: TestSequencerProject,
  elements: TestSequenceElement[],
  throwInsteadOfResult: boolean = false,
): Promise<Result<null, Error>> {
  // Verify that the elements are within the current project directory.
  try {
    await throwIfNotInAllBaseFolder(elements, project.projectPath);
    return Ok(null);
  } catch (e: unknown) {
    if (throwInsteadOfResult) throw e;
    return buildResultFromCatch(e);
  }
}

// Private -------------------------------------------------------------------------------------------------

function buildResultFromCatch(e: unknown): Result<null, Error> {
  if (e instanceof Error) {
    return Err(e);
  } else {
    console.error("[SaveProject] Unknown error", e);
    return Err(new Error("Unknown error while creating the project"));
  }
}

function validatePath(project: TestSequencerProject): TestSequencerProject {
  let path = project.projectPath;
  if (!path.endsWith("/")) {
    path = path + "/";
  }
  return updatePath(project, path);
}

function updatePath(
  project: TestSequencerProject,
  newPath: string,
): TestSequencerProject {
  return {
    ...project,
    projectPath: newPath,
  };
}

async function saveToDisk(project: TestSequencerProject): Promise<void> {
  if ("api" in window) {
    // Deps
    if (project.interpreter.requirementsPath) {
      const deps = await window.api.poetryShowUserGroup();
      const content = deps
        .map((dep) => dep.name + "==" + dep.version)
        .join("\n");
      await window.api.saveToFile(
        project.projectPath + project.interpreter.requirementsPath,
        content,
      );
    }
    // Project
    await window.api.saveToFile(
      project.projectPath + project.name + ".tjoy",
      stringifyProject(project),
    );
  } else {
    throw new Error("Not able to save to disk");
  }
}

async function installDeps(project: TestSequencerProject): Promise<boolean> {
  if ("api" in window) {
    const succes = await window.api.poetryInstallRequirementsUserGroup(
      project.projectPath + project.interpreter.requirementsPath,
    );
    return succes;
  } else {
    throw new Error("Not able to install requirements."); // TODO: Better error
  }
}

async function syncProject(
  project: TestSequencerProject,
  stateManager: StateManager,
): Promise<void> {
  const elements = await createTestSequencerElementsFromProjectElements(
    project,
    project.projectPath,
    false,
  );
  stateManager.setElems(elements);
  stateManager.setProject(project);
  stateManager.setUnsaved(false);
}

async function createProjectElementsFromTestSequencerElements(
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
          elem.testName,
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

async function createTestSequencerElementsFromProjectElements(
  project: TestSequencerProject,
  baseFolder: string,
  verifStateOrThrow: boolean,
): Promise<TestSequenceElement[]> {
  const elements: TestSequenceElement[] = [...project.elems].map((elem) => {
    return elem.type === "test"
      ? createNewTest(
          elem.testName,
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

function updateProjectElements(
  project: TestSequencerProject,
  elements: TestSequenceElement[],
): TestSequencerProject {
  return {
    ...project,
    elems: elements,
  };
}
