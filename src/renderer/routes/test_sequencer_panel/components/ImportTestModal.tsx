import { Button } from "@/renderer/components/ui/button";
import { Checkbox } from "@/renderer/components/ui/checkbox";
import { Dialog, DialogContent } from "@/renderer/components/ui/dialog";
import { Separator } from "@/renderer/components/ui/separator";
import { useTestImport } from "@/renderer/hooks/useTestImport";
import { useTestSequencerState } from "@/renderer/hooks/useTestSequencerState";
import { useAppStore } from "@/renderer/stores/app";
import { ExternalLinkIcon } from "lucide-react";
import { Dispatch, SetStateAction, useState } from "react";
import { useShallow } from "zustand/react/shallow";

export type ImportTestSettings = {
  importAsOneRef: boolean;
  importType: ImportType;
};

export type ImportType = "Pytest" | "Python";

type Props = {
  isModalOpen: boolean;
  handleModalOpen: Dispatch<SetStateAction<boolean>>;
};

export const ImportTestModal = ({ isModalOpen, handleModalOpen }: Props) => {
  const [checked, setChecked] = useState<boolean>(false);

  const { setIsDepManagerModalOpen } = useAppStore(
    useShallow((state) => ({
      setIsDepManagerModalOpen: state.setIsDepManagerModalOpen,
    })),
  );

  const openFilePicker = useTestImport();
  const { setIsLocked } = useTestSequencerState();

  const handleImportTest = (importType: ImportType) => {
    setIsLocked(true);
    openFilePicker(
      {
        importType: importType,
        importAsOneRef: checked,
      },
      handleModalOpen,
    );
    setIsLocked(false);
  };

  return (
    <Dialog open={isModalOpen} onOpenChange={handleModalOpen}>
      <DialogContent>
        <h2 className="text-lg font-bold text-accent1">
          Import Python Scripts & Tests
        </h2>
        <Button variant={"outline"} onClick={() => handleImportTest("Pytest")}>
          Pytest & Unittest
        </Button>
        <Button variant={"outline"} onClick={() => handleImportTest("Python")}>
          Python Script
        </Button>
        <Separator />
        <div className="flex justify-between">
          <div className="flex items-center space-x-2 text-xs">
            <Checkbox
              checked={checked}
              onCheckedChange={(checked) => {
                setChecked(checked as boolean);
              }}
            />
            <label>Import all tests as one test</label>
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
