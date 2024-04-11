import { Button } from "@/renderer/components/ui/button";
import { Dialog, DialogContent } from "@/renderer/components/ui/dialog";
import { Input } from "@/renderer/components/ui/input";
import { useState } from "react";


export const RenameModal  = ({
  isModalOpen,
  setModalOpen,
  initialName,
  handleSubmit,
  target,
}: {
  isModalOpen: boolean;
  setModalOpen: (value: boolean) => void;
  initialName: string;
  handleSubmit: (newName: string) => void;
  target: string | undefined;
}) => {
  const [newName, setNewName] = useState<string>(initialName);


  return (
    <Dialog
      open={isModalOpen}
      onOpenChange={setModalOpen}
    >
      <DialogContent>
        <h2 className="text-lg font-bold text-accent1 ">Rename</h2>
        { target && 
          <div className="pb-1 text-muted-foreground">
            <h2>{target}</h2>
          </div>
        }
        <Input
          placeholder="New Name"
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
        />
        <Button onClick={() => handleSubmit(newName)}>Rename</Button>
      </DialogContent>
    </Dialog>
  );
};
