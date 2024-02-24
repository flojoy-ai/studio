import { Button } from "@/renderer/components/ui/button";
import { Checkbox } from "@/renderer/components/ui/checkbox";
import { Dialog, DialogContent } from "@/renderer/components/ui/dialog";
import { Separator } from "@/renderer/components/ui/separator";
import { useTestImport } from "@/renderer/hooks/useTestImport";
import { useTestSequencerState } from "@/renderer/hooks/useTestSequencerState";
import { ExternalLinkIcon } from "lucide-react";
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
  const [importType, setImportType] = useState<string>("Pytest");
  const openFilePicker = useTestImport();
  const { setIsLocked } = useTestSequencerState();

  const handleImportTest = () => {
    setIsLocked(true);
    let error = openFilePicker({
      importAsOneRef: checked,
    });
    setIsLocked(false);
    if (error === null) {
      handleModalOpen(false);
    }
  };

  return (
    <Dialog open={isModalOpen} onOpenChange={handleModalOpen}>
      <DialogContent>
        <h2 className="text-lg font-bold text-accent1"> Import Python Scripts & Tests </h2>
        
        <Button variant={"outline"} onClick={handleImportTest}>Pytest & Unittest</Button>
        <Button variant={"outline"} onClick={handleImportTest}>Python Script</Button>
        <Separator/>
        <div className="flex justify-between">
          <div className="flex text-xs items-center space-x-2">
            <Checkbox
              checked={checked}
              onCheckedChange={(checked) => {
                setChecked(checked as boolean);
              }}
            />
            <label>Import all tests as one test</label>
          </div>
          <div className="justify-end">
            <Button variant={"link"} onClick={handleImportTest}> <ExternalLinkIcon size={15} className="mr-1"/> Dependency Manager</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
