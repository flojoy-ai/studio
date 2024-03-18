import { Button } from "@/renderer/components/ui/button";
import { Dialog, DialogContent } from "@/renderer/components/ui/dialog";
import { Input } from "@/renderer/components/ui/input";
import { useModalState } from "@/renderer/hooks/useModalState";
import { useTestSequencerState } from "@/renderer/hooks/useTestSequencerState";
import { useState, useEffect } from "react";


export const RenameTestModal = () => {
  const { renameTestId, isRenameTestModalOpen, setIsRenameTestModalOpen } =
    useModalState();
  const { elems, setElems, project } = useTestSequencerState();
  const [testName, setTestName] = useState<string>("")
  const [target, setTarget] = useState<string>("")

  useEffect(() => {
    const test = elems.find((elem) => elem.id === renameTestId);
    if (test !== undefined && test.type === "test") {
      setTestName(test.testName);
      let path = test.path;
      if (project !== null) {
        path = path.replace(project.projectPath, "");
      }
      if (path.length > 50) {
        path = "..." + path.slice(path.length - 50, path.length);
      }
      setTarget(path);
    }
  }, [elems, renameTestId]);

  function handleClick() {
    setElems(
      elems.map((elem) => {
        if (elem.id === renameTestId) {
          return { ...elem, testName: testName };
        } else {
          return elem;
        }
      }),
    );
    setIsRenameTestModalOpen(false, null);
  }

  return (
    <Dialog
      open={isRenameTestModalOpen}
      onOpenChange={setIsRenameTestModalOpen}
    >
      <DialogContent>
        <h2 className="text-lg font-bold text-accent1 ">Rename Test</h2>
        <div className="pb-1 text-muted-foreground">
          <h2>{target}</h2>
        </div>
        <Input
          placeholder="New Name"
          value={testName}
          onChange={(e) => setTestName(e.target.value)}
        />
        <Button onClick={handleClick}>Rename</Button>
      </DialogContent>
    </Dialog>
  );
};
