import { join } from "path";
import { v4 as uuidv4 } from "uuid";
import { Button } from "@/renderer/components/ui/button";
import { Dialog, DialogContent } from "@/renderer/components/ui/dialog";
import {
  createNewTest,
  useTestSequencerState,
} from "@/renderer/hooks/useTestSequencerState";
import { useModalState } from "@/renderer/routes/test_sequencer_panel/modals/useModalState";
import { useTestGenerateStore } from "./TestGeneratorPanel";
import { toast } from "sonner";
import { useEffect, useState } from "react";
import { Input } from "@/renderer/components/ui/input";

const createNewTestFile = (path: string, code: string) => {
  if (path === undefined) {
    throw new Error("Project path is undefined, please create a new project");
  }
  saveFile(path, code);
};

export const useFillPlaceholdersAndAddTest = () => {
  const {
    setPlaceholdersForGeneratedTest,
    showInputsForGeneratedTestModal,
    setCallbackForInputsForGeneratedTestModal,
  } = useModalState();

  const { addTest } = useTestGenerateStore();
  const { project } = useTestSequencerState();
  if (project == null) throw new Error("Project doesn't exist");
  const path = project?.projectPath;

  const createTest = (name: string, code: string) => {
    const filePath = join(path, name);
    createNewTestFile(filePath, code);
    addTest(createNewTest(name, filePath, "python", false, uuidv4(), uuidv4()));
  };

  const fillPlaceholdersAndAddTest = (name: string, code: string) => {
    const subStrs = code.split("$$$"); //using $$$ token as placeholder identifier

    //edge case: no user input placeholders
    if (subStrs.length == 1) {
      createTest(name, code);
      return;
    }

    //extract placeholders
    const placeholders: string[] = [];
    for (let i = 1; i < subStrs.length; i += 2) {
      placeholders.push(subStrs[i]);
    }
    console.log("placeholders", placeholders);

    //set the placeholder fields to display in the modal
    setPlaceholdersForGeneratedTest(placeholders);

    //define the callback upon completing the user inputs
    setCallbackForInputsForGeneratedTestModal((placeholderValues: string[]) => {
      let j = 0;
      for (let i = 1; i < subStrs.length; i += 2) {
        subStrs[i] = placeholderValues[j++];
      }
      const resultingCode = subStrs.join("");
      createTest(name, resultingCode);
    });

    //open the modal
    showInputsForGeneratedTestModal();
  };

  return fillPlaceholdersAndAddTest;
};

const saveFile = async (fullPath: string, value: string) => {
  const res = await window.api.saveFileToFullPath(fullPath, value);
  if (!res.isOk()) {
    toast.error("Error when trying to save file", {
      description: res.error.message,
    });
  }
};

export const TestGenerationInputModal = () => {
  const {
    placeholdersForGeneratedTest,
    callbackForInputsForGeneratedTestModal,
    inputsForGeneratedTestModalState: isModalOpen,
    setInputsForGeneratedTestModal: handleModalOpen,
  } = useModalState();

  const [inputs, setInputs] = useState(
    Array(placeholdersForGeneratedTest.length).fill(""),
  );

  const handleSubmitClick = () => {
    callbackForInputsForGeneratedTestModal(inputs);
  };

  useEffect(() => {
    return () => {
      setInputs([]);
    };
  }, [isModalOpen]);

  return (
    <Dialog open={isModalOpen} onOpenChange={handleModalOpen}>
      <DialogContent className="h-3/4 overflow-y-scroll">
        <div>
          {placeholdersForGeneratedTest.map((placeholder, i) => (
            <div className="m-6 space-y-3" key={"testgenerationinput-" + i}>
              <p>{placeholder}:</p>
              <Input
                type="text"
                value={inputs[i]}
                onChange={(e) =>
                  setInputs((inputs) => {
                    const newInputs = [...inputs];
                    newInputs[i] = e.target.value;
                    return newInputs;
                  })
                }
              />
            </div>
          ))}
        </div>
        <Button onClick={handleSubmitClick}>Submit</Button>
      </DialogContent>
    </Dialog>
  );
};
