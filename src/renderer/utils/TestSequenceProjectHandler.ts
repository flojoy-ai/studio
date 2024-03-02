// Exposed function in this file should alway follow the following pattern:
// My Idea: Take the project as an Input.
//   1. Always valide the state of the proejct
//   2. Do the operation
//   3. Update the test sequencer

import { Err, Ok, Result } from "@/types/result";
import { useTestSequencerState } from "@/renderer/hooks/useTestSequencerState";
import { readJsonProject, stringifyProject } from "@/renderer/routes/test_sequencer_panel/utils/TestSetUtils";
import { TestSequenceElement, TestSequencerProject } from "@/renderer/types/testSequencer";

// Exposed API
export async function createProject(project: TestSequencerProject): Promise<Result<null, Error>> {
  // Create a new project from the element currently in the test sequencer
  // - Will valide that each element is in the base folder
  return await saveProject(project);
}

export async function saveProject(project: TestSequencerProject | null = null): Promise<Result<null, Error>> {
  // Save the current project to disk
  try {
    if (!project) {
      const { project: p } = useTestSequencerState();
      if (!p) {
        return Err(new Error("No project to save"));
      }
      project = p;
    }
    const { elems } = useTestSequencerState();
    project = validatePath(project);
    project = updateProjectElements(project, await createProjectElementsFromTestSequencerElements(elems, project.projectPath, true));
    syncProject(project)
    return Ok(null);
  } catch (e: unknown) {
    if (e instanceof Error) {
      return Err(e);
    } else {
      console.error("[SaveProject] Unknown error", e);
      return Err(new Error("Unknown error while creating the project"));
    }
  }

}

export async function importProject(filePath: string, fileContent: string): Promise<Result<null, Error>> {
  // From a file, import a project and update the test sequencer
  // * Importing a project overwrites the current project, even the test sequencer is unsaved
  try {
    let project = readJsonProject(fileContent);
    if (!project) {
      return Err(new Error("Error reading project file"));
    }
    const projectPath = filePath.replace(project.name + ".tjoy", "");
    project = updatePath(project, projectPath);
    project = updateProjectElements(project, await createTestSequencerElementsFromProjectElements(project, project.projectPath, true));
    syncProject(project);
    return Ok(null);
  } catch (e: unknown) {
    if (e instanceof Error) {
      return Err(e);
    } else {
      console.error("[ImportProject] Unknown error", e);
      return Err(new Error("Unknown error while importing the project"));
    }
  }
}

export async function exportProject(project: TestSequencerProject) {
  // Export the current project as a zip file without any dependencies
  await saveProject(project);
  return Err(new Error("Export Not Implemented"));
}

export async function closeProject(project: TestSequencerProject, save: boolean): Promise<Result<null, Error>> {
  // Delete the current proejct from the app. The project is NOT deleted from disk
  if (save) {
    await saveProject(project);
  }
  const { setProject } = useTestSequencerState();
  setProject(null);
  return Ok(null);
}

export async function verifyElementCompatible(project: TestSequencerProject, elements: TestSequenceElement[]) {
  // Add elements to the current project. Currently throw an error if the elements are not in the base folder
  try {
    throwIfNotInAllBaseFolder(elements, project.projectPath);
  } catch (e: unknown) {
    if (e instanceof Error) {
      return Err(e);
    } else {
      console.error("[VerifyElementCompatible] Unknown error", e);
      return Err(new Error("Unknown error while adding ekement to the project"));
    }
  }
}

// Private -------------------------------------------------------------------------------------------------
function validatePath(project: TestSequencerProject): TestSequencerProject {
    const sep = project.projectPath.endsWith("/") ? "" : "/";
    const path = project.projectPath + sep;
    return updatePath(project, path);
}

function updatePath(project: TestSequencerProject, newPath: string): TestSequencerProject {
  return {
    ...project,
    projectPath: newPath
  }
}

async function syncProject(project: TestSequencerProject) {
  if ("api" in window) {
    await window.api.saveToFile(
      project.projectPath + project.name + ".tjoy",
      stringifyProject(project)
    );
  }
  const { setProject, setUnsaved } = useTestSequencerState();
  const elements = await createTestSequencerElementsFromProjectElements(project, project.projectPath, false);
  setProject(project);
  syncElements(elements);
  setUnsaved(false);
}

async function syncElements(element: TestSequenceElement[]) {
  const { setElems } = useTestSequencerState();
  setElems(() => element);
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
        testName: elem.path.replace(baseFolder, ""),
        path: elem.path.replace(baseFolder, "")
      }
      : {
        ...elem,
        condition: elem.condition.replace(baseFolder, "")
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
  for (let elem of elems) {
    let weGoodBro = false 
    if (elem.type === "conditional") {
      continue;
    }
    if (elem.path.startsWith(baseFolder)) {
      // Python
      continue;
    } 
    if ('api' in window) {
      await window.api.isFileOnDisk(baseFolder + elem.path)
        .then((result) => {
          if (result) {
            weGoodBro = true;
          }
        });
    }
    // New test type ? Handle it here
    if (!weGoodBro) {
      throw new Error(`The element ${elem.path} is not in the base folder ${baseFolder}`);
    }
  }
}

function updateProjectElements(project: TestSequencerProject, elements: TestSequenceElement[]): TestSequencerProject {
  return {
    ...project,
    elems: elements
  }
}

