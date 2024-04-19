import { Button } from "@/renderer/components/ui/button";
import { Checkbox } from "@/renderer/components/ui/checkbox";
import { Dialog, DialogContent } from "@/renderer/components/ui/dialog";
import { Input } from "@/renderer/components/ui/input";
import { PathInput } from "@/renderer/components/ui/path-input";
import { Separator } from "@/renderer/components/ui/separator";
import { useDiscoverAndImportTests } from "@/renderer/hooks/useTestImport";
import { createNewTest, useDisplayedSequenceState } from "@/renderer/hooks/useTestSequencerState";
import { useAppStore } from "@/renderer/stores/app";
import { useSequencerModalStore } from "@/renderer/stores/modal";
import { ExternalLinkIcon } from "lucide-react";
import { useState } from "react";
import { useShallow } from "zustand/react/shallow";

export type ImportTestSettings = {
  importAsOneRef: boolean;
  importType: ImportType;
};

export type ImportType = "pytest" | "python" | "robotframework";

export const ImportTestModal = () => {
  const { isImportTestModalOpen, setIsImportTestModalOpen } =
    useSequencerModalStore();
  const [checked, setChecked] = useState<boolean>(false);

  const { setIsDepManagerModalOpen } = useAppStore(
    useShallow((state) => ({
      setIsDepManagerModalOpen: state.setIsDepManagerModalOpen,
    })),
  );

  const openFilePicker = useDiscoverAndImportTests();
  const { setIsLocked } = useDisplayedSequenceState();
  const { addNewElems } = useDisplayedSequenceState();

  const handleImportTest = async (importType: ImportType) => {
    setIsLocked(true);
    if (importType === "robotframework") {
      const newElem = createNewTest(
        testName,
        filePath,
        "robotframework",
        false,
        undefined,
        undefined,
        undefined,
        undefined,
        undefined,
        [testName]
      )
      console.log(newElem);
      const res = await addNewElems([newElem]);
      console.log(res);
      setIsImportTestModalOpen(false);
    } else {
      openFilePicker(
        {
          importType: importType,
          importAsOneRef: checked,
        },
        setIsImportTestModalOpen,
      );
    }
    setIsLocked(false);
  };

  const [testName, setRobotPath] = useState<string>("");
  const [filePath, setProjectDirPath] = useState<string>("");

  return (
    <Dialog
      open={isImportTestModalOpen}
      onOpenChange={setIsImportTestModalOpen}
    >
      <DialogContent>
        <h2 className="text-lg font-bold text-accent1">Robot Framework Test</h2>
        <Input value={testName} placeholder="Robot.test name" onChange={(e) => setRobotPath(e.target.value)} />
        <PathInput
          placeholder="file.robot"
          allowedExtention={["robot"]}
          onChange={(event) => {
            setProjectDirPath(event.target.value);
          }}
          pickerType="file"
          allowDirectoryCreation={true}
        />
        <Button variant={"outline"} onClick={() => handleImportTest("robotframework")}>
          Add Test
        </Button>
        <Separator />
        <div className="flex justify-between">
          <div className="flex items-center space-x-2 text-xs">
          </div>
          <div className="justify-end">
            <Button
              variant={"link"}
              onClick={() => setIsDepManagerModalOpen(true)}
            >
              <ExternalLinkIcon size={15} className="mr-1" /> Dependency Manager
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
