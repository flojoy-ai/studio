import { Dialog, DialogContent } from "@/renderer/components/ui/dialog";
import { Button } from "@/renderer/components/ui/button";
import { useState } from "react";
import { Input } from "@/renderer/components/ui/input";


export const WriteMinMaxModal = ({
  isModalOpen,
  setModalOpen,
  handleWrite,
}: {
  isModalOpen: boolean;
  setModalOpen: (value: boolean) => void;
  handleWrite: (min: number, max: number, unit: string) => void;
}) => {
  const [min, setMin] = useState(0);
  const [max, setMax] = useState(0);
  const [unit, setUnit] = useState("");

  return (
    <Dialog
      open={isModalOpen}
      onOpenChange={setModalOpen}
    >
      <DialogContent>
        <h2 className="text-lg font-bold text-accent1"> Edit Expected Value </h2>

        <div className="flex gap-2">
          <div className="grow pb-1 text-xs">
            <p className="mb-1 text-muted-foreground">Mininum</p>
            <Input
              type="number"
              placeholder="11.5..."
              value={min}
              onChange={(e) => {
                setMin(parseFloat(e.target.value));
              }}
            />
          </div>

          <div className="grow pb-1 text-xs">
            <p className="mb-1 text-muted-foreground">Maximum</p>
            <Input
              type="number"
              placeholder="12.5..."
              value={max}
              onChange={(e) => {
                setMax(parseFloat(e.target.value));
              }}
            />
          </div>

          <div className="grow pb-1 text-xs">
            <p className="mb-1 text-muted-foreground">Displayed Unit</p>
            <Input
              placeholder="Volt"
              value={unit}
              onChange={(e) => {
                setUnit(e.target.value);
              }}
            />
          </div>
        </div>
        <Button
          onClick={() => {
            handleWrite(min, max, unit);
            setModalOpen(false);
          }}
        >
          Submit
        </Button>
      </DialogContent>
    </Dialog>
  );
};
