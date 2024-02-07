import { Button } from "@/renderer/components/ui/button";
import { Checkbox } from "@/renderer/components/ui/checkbox";
import { Dialog, DialogContent } from "@/renderer/components/ui/dialog";
import { useTestImport } from "@src/hooks/useTestImport";
import { Dispatch, SetStateAction, useState } from "react";

export type ImportTestSettings = {
  importAsOneRef: boolean;
};

export const ImportTestModal = ({
  isModalOpen,
  handleModalOpen,
}: {
  isModalOpen: boolean;
  handleModalOpen: Dispatch<SetStateAction<boolean>>;
  handleImport: () => void;
}) => {
  const openFilePicker = useTestImport();

  const handleImportTest = (settings: ImportTestSettings) => {
    openFilePicker(settings);
  };
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [checked, setChecked] = useState<boolean>(false);

  const testSettings: ImportTestSettings = {
    importAsOneRef: checked,
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
        <Button onClick={() => handleImportTest(testSettings)}>
          Chose file
        </Button>
      </DialogContent>
    </Dialog>
  );
};
