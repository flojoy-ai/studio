// Exposed function in this file should alway follow the following pattern:
// My Idea: Take the project as an Input.
//   1. Always valide the state of the proejct
//   2. Do the operation
//   3. Update the test sequencer
//   4. Return a Result<T, Error>

import { Err, Ok, Result } from "@/types/result";
import { readJsonProject, stringifyProject } from "@/renderer/routes/test_sequencer_panel/utils/TestSetUtils";
import { TestSequenceElement, TestSequencerProject } from "@/renderer/types/testSequencer";


// Exposed API
export type StateManager = {
  elem: TestSequenceElement[];
  setElems: (elems: TestSequenceElement[]) => void;
  project: TestSequencerProject | null;
  setProject: (project: TestSequencerProject | null) => void;
  setUnsaved: (unsaved: boolean) => void;
}

export async function createProject(project: TestSequencerProject, stateManager: StateManager, throwInsteadOfResult: boolean=false): Promise<Result<null, Error>> {
  // Create a new project from the element currently in the test sequencer
  // - Will valide that each element is in the base folder
  try {
    const elems = stateManager.elem;
    project = validatePath(project);
    project = updateProjectElements(project, await createProjectElementsFromTestSequencerElements(elems, project.projectPath, true));
    syncProject(project, stateManager);
    return Ok(null);
  } catch (e: unknown) {
    if (throwInsteadOfResult) throw e;
    return buildResultFromCatch(e); 
  }
}

export async function saveProject(stateManager: StateManager, throwInsteadOfResult: boolean=false): Promise<Result<null, Error>> {
  // Save the current project to disk
  try {
    let project = stateManager.project;
    if (!project) {
      return Err(new Error("No project to save"));
    }
    const elems = stateManager.elem;
    project = validatePath(project);
    project = updateProjectElements(project, await createProjectElementsFromTestSequencerElements(elems, project.projectPath, true));
    syncProject(project, stateManager);
    return Ok(null);
  } catch (e: unknown) {
    if (throwInsteadOfResult) throw e;
    return buildResultFromCatch(e); 
  }

}

export async function importProject(filePath: string, fileContent: string, stateManager: StateManager, throwInsteadOfResult: boolean=false): Promise<Result<null, Error>> {
  // From a file, import a project and update the test sequencer
  // * Importing a project overwrites the current project, even the test sequencer is unsaved
  try {
    let project = readJsonProject(fileContent);
    if (!project) {
      return Err(new Error("Error reading project file"));
    }
    const projectPath = filePath.replaceAll(project.name + ".tjoy", "");
    project = updatePath(project, projectPath);
    syncProject(project, stateManager);
    return Ok(null);
  } catch (e: unknown) {
    if (throwInsteadOfResult) throw e;
    return buildResultFromCatch(e); 
  }
}

export async function exportProject(stateManager: StateManager, throwInsteadOfResult: boolean=false): Promise<Result<null, Error>> {
  // Export the current project as a zip file without any dependencies
  await saveProject(stateManager);
  return Err(new Error("Export Not Implemented"));
}

export async function closeProject(save: boolean, stateManager: StateManager, throwInsteadOfResult: boolean=false): Promise<Result<null, Error>> {
  // Close the current proejct from the app. The project is NOT deleted from disk
  if (save) {
    await saveProject(stateManager, throwInsteadOfResult);
  }
  stateManager.setProject(null);
  return Ok(null);
}

export async function verifyElementCompatibleWithProject(project: TestSequencerProject, elements: TestSequenceElement[], throwInsteadOfResult: boolean=false): Promise<Result<null, Error>> {
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
  const { getPathSeparator } = window.api
  const sep = getPathSeparator();
  if (!project.projectPath.endsWith(sep)) {
    return updatePath(project, project.projectPath + sep);
  }
  return project;
}

function updatePath(project: TestSequencerProject, newPath: string): TestSequencerProject {
  return {
    ...project,
    projectPath: newPath
  }
}

async function syncProject(project: TestSequencerProject, stateManager: StateManager): Promise<void> {
  if ("api" in window) {
    await window.api.saveToFile(
      project.projectPath + project.name + ".tjoy",
      stringifyProject(project)
    );
  }
  const elements = await createTestSequencerElementsFromProjectElements(project, project.projectPath, false);
  stateManager.setElems(elements);
  stateManager.setProject(project);
  stateManager.setUnsaved(false);
}

async function createProjectElementsFromTestSequencerElements(
  elems: TestSequenceElement[],
  baseFolder: string, 
  verifStateOrThrow: boolean
): Promise<TestSequenceElement[]> {
  if (verifStateOrThrow) {
  await throwIfNotInAllBaseFolder(elems, baseFolder);
  }
  const elements = [...elems].map((elem) => {
    return elem.type === "test"
      ? {
        ...elem,
        status: "pending",
        completionTime: undefined,
        error: null,
        isSavedToCloud: false,
        testName: elem.path.replaceAll(baseFolder, ""),
        path: elem.path.replaceAll(baseFolder, "")
      }
      : {
        ...elem,
        condition: elem.condition.replaceAll(baseFolder, "")
      };
  });
  // @ts-ignore because LSP can't understand the element.type
  return elements;
}

async function createTestSequencerElementsFromProjectElements(
  project: TestSequencerProject,
  baseFolder: string, 
  verifStateOrThrow: boolean
): Promise<TestSequenceElement[]> {
  const elements: TestSequenceElement[] = [...project.elems].map((elem) => {
    return elem.type === "test"
      ? {
        ...elem,
        status: "pending",
        completionTime: undefined,
        error: null,
        isSavedToCloud: false,
        path: baseFolder + elem.path
      }
      : {
        ...elem,
      };
  });
  if (verifStateOrThrow) {
    await throwIfNotInAllBaseFolder(elements, baseFolder);
  }
  return elements;
}

async function throwIfNotInAllBaseFolder(elems: TestSequenceElement[], baseFolder: string) {
  const { getPathSeparator } = window.api
  const sep = getPathSeparator();
  for (let elem of elems) {
    let weGoodBro = false 
    if (elem.type === "conditional") {
      continue;
    }
    let path = elem.path;
    if (sep === "\\") {
      path = path.replace(/(?<!\\)\//g, '\\')  // Replace / with \ if not preceded by \ (escaped)
    }
    if (path.startsWith(baseFolder)) {
      // Absolute path
      continue;
    } 
    if ('api' in window) {
      // Relative path
      await window.api.isFileOnDisk(baseFolder + path)
        .then((result) => {
          if (result) {
            weGoodBro = true;
          }
        }).catch((e) => {
          console.error("Error while checking if file is on disk", e);
          throw new Error(`Error while checking if the file is on disk`);
        }
      );
    }
    // New test type ? Handle it here
    if (!weGoodBro) {
      throw new Error(`The element ${path} is not in the base folder ${baseFolder}`);
    }
  }
}

function updateProjectElements(project: TestSequencerProject, elements: TestSequenceElement[]): TestSequencerProject {
  return {
    ...project,
    elems: elements
  }
}

