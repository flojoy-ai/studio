import { Button } from "@src/components/ui/button";
import { Checkbox } from "@src/components/ui/checkbox";
import { Dialog, DialogContent } from "@src/components/ui/dialog";
import { useTestImport } from "@src/hooks/useTestImport";
import { Dispatch, MutableRefObject, SetStateAction, useRef } from "react";

export type ImportTestSettings = {
  importAsOneRef: MutableRefObject<boolean | string>;
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
  const isChecked = useRef<boolean | string>(false);

  const testSettings = {
    importAsOneRef: isChecked,
  };

  return (
    <Dialog open={isModalOpen} onOpenChange={handleModalOpen}>
      <DialogContent>
        <div className="flex items-center space-x-2">
          <Checkbox
            onCheckedChange={(checked) => {
              isChecked.current = checked;
              console.log(isChecked.current);
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
