import { Button } from "@/renderer/components/ui/button";
import { Dialog, DialogContent } from "@/renderer/components/ui/dialog";
import { Input } from "@/renderer/components/ui/input";
import { useEffect, useState } from "react";

export const RenameModal = ({
  title,
  isModalOpen,
  setModalOpen,
  initialName,
  handleSubmit,
  target,
}: {
  title: string;
  isModalOpen: boolean;
  setModalOpen: (value: boolean) => void;
  initialName: string;
  handleSubmit: (newName: string) => void;
  target: string;
}) => {
  const [newName, setNewName] = useState<string>(initialName);
  useEffect(() => {
    setNewName(initialName);
  }, [initialName]);

  return (
    <Dialog open={isModalOpen} onOpenChange={setModalOpen}>
      <DialogContent>
        <h2 className="text-lg font-bold text-accent1">{title}</h2>
        <div className="pb-1 text-muted-foreground">
          <h2>{target}</h2>
        </div>
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
