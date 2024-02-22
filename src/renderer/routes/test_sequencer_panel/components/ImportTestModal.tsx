import { Button } from "@/renderer/components/ui/button";
import { Checkbox } from "@/renderer/components/ui/checkbox";
import { Dialog, DialogContent } from "@/renderer/components/ui/dialog";
import { useTestImport } from "@/renderer/hooks/useTestImport";
import { useTestSequencerState } from "@/renderer/hooks/useTestSequencerState";
import { Dispatch, SetStateAction, useState } from "react";

export type ImportTestSettings = {
  importAsOneRef: boolean;
};

type Props = {
  isModalOpen: boolean;
  handleModalOpen: Dispatch<SetStateAction<boolean>>;
};

export const ImportTestModal = ({ isModalOpen, handleModalOpen }: Props) => {
  const [checked, setChecked] = useState<boolean>(false);
  const openFilePicker = useTestImport();
  const { setIsLocked } = useTestSequencerState();

  const handleImportTest = () => {
    setIsLocked(true);
    openFilePicker({
      importAsOneRef: checked,
    });
    setIsLocked(false);
    handleModalOpen(false);
  };

  return (
    <Dialog open={isModalOpen} onOpenChange={handleModalOpen}>
      <DialogContent>
        <div className="flex items-center space-x-2">
          <Checkbox
            checked={checked}
            onCheckedChange={(checked) => {
              setChecked(checked as boolean);
            }}
          />
          <label>Import file as one test</label>
        </div>
        <Button onClick={handleImportTest}>Chose file</Button>
      </DialogContent>
    </Dialog>
  );
};
