import { Dialog, DialogContent } from "@src/components/ui/dialog";
import { CONDITIONALS, CONDITIONAL_TYPES } from "@src/types/testSequencer";
import { Button } from "@src/components/ui/button";
import { Dispatch, SetStateAction } from "react";

export const AddConditionalModal = ({
  isConditionalModalOpen,
  handleAddConditionalModalOpen,
  handleAdd,
}: {
  isConditionalModalOpen: boolean;
  handleAddConditionalModalOpen: Dispatch<SetStateAction<boolean>>;
  handleAdd: (type: CONDITIONAL_TYPES) => void;
}) => {
  return (
    <Dialog
      open={isConditionalModalOpen}
      onOpenChange={handleAddConditionalModalOpen}
    >
      <DialogContent>
        {CONDITIONALS.map((type) => {
          return <Button onClick={() => handleAdd(type)}>{type}</Button>;
        })}
      </DialogContent>
    </Dialog>
  );
};
