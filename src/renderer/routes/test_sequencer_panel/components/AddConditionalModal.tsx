import { Dialog, DialogContent } from "@/renderer/components/ui/dialog";
import {
  CONDITIONALS,
  ConditionalComponent,
} from "@/renderer/types/testSequencer";
import { Button } from "@/renderer/components/ui/button";
import { Dispatch, SetStateAction } from "react";

export const AddConditionalModal = ({
  isConditionalModalOpen,
  handleAddConditionalModalOpen,
  handleAdd,
}: {
  isConditionalModalOpen: boolean;
  handleAddConditionalModalOpen: Dispatch<SetStateAction<boolean>>;
  handleAdd: (type: ConditionalComponent) => void;
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
