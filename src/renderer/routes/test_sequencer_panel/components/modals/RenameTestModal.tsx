import { Button } from "@/renderer/components/ui/button";
import { Dialog, DialogContent } from "@/renderer/components/ui/dialog";
import { Input } from "@/renderer/components/ui/input";
import { useModalState } from "@/renderer/hooks/useModalState";
import { useTestSequencerState } from "@/renderer/hooks/useTestSequencerState";
import { useModalStore } from "@/renderer/stores/modal";
import { useState } from "react";

export const RenameTestModal = () => {
  const { isRenameTestModalOpen, setIsRenameTestModalOpen } =
    useModalStore();
  const { renameTestId } = useModalState();
  const { elems, setElems } = useTestSequencerState();
  const [testName, setTestName] = useState<string>("");

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
    <Dialog open={isRenameTestModalOpen} onOpenChange={() => setIsRenameTestModalOpen(false, null)}>
      <DialogContent>
        <h2 className="text-lg font-bold text-accent1 ">
          Rename Test
        </h2>
        <Input placeholder="New Name" value={testName} onChange={(e) => setTestName(e.target.value)} />
        <Button onClick={handleClick}>Rename</Button>
      </DialogContent>
    </Dialog>
  );
};

