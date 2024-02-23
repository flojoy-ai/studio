import { Dialog, DialogContent } from "@/renderer/components/ui/dialog";
import { Button } from "@/renderer/components/ui/button";
import { Dispatch, SetStateAction, useState } from "react";
import { Input } from "@/renderer/components/ui/input";
import { Select } from "@/renderer/components/ui/select";

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
        <h2 className="text-lg font-bold text-accent1"> Add Conditional </h2>
        <Input type="text" placeholder="$file.py::test_name & $file.py::test_name" value={value} onChange={handleInputChange} />
        <Button onClick={() => handleWrite(value)}>Submit</Button>
      </DialogContent>
    </Dialog>
  );
};
