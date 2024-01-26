import { Dialog, DialogContent } from "@src/components/ui/dialog";
import { Button } from "@src/components/ui/button";
import { Dispatch, SetStateAction, useState } from "react";
import { Input } from "@src/components/ui/input";

export const WriteConditionalModal = ({
  isConditionalModalOpen,
  handleWriteConditionalModalOpen,
  handleWrite,
}: {
  isConditionalModalOpen: boolean;
  handleWriteConditionalModalOpen: Dispatch<SetStateAction<boolean>>;
  handleWrite: (input: string) => void;
}) => {
  const [value, setValue] = useState("");
  const handleInputChange = (e) => {
    setValue(e.target.value);
  };
  return (
    <Dialog
      open={isConditionalModalOpen}
      onOpenChange={handleWriteConditionalModalOpen}
    >
      <DialogContent>
        <Input type="text" value={value} onChange={handleInputChange} />
        <Button onClick={() => handleWrite(value)}>Submit</Button>
      </DialogContent>
    </Dialog>
  );
};
