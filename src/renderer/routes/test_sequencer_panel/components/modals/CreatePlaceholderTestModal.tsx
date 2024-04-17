import { Button } from "@/renderer/components/ui/button";
import { Dialog, DialogContent } from "@/renderer/components/ui/dialog";
import { Input } from "@/renderer/components/ui/input";
import { createNewTest, useDisplayedSequenceState } from "@/renderer/hooks/useTestSequencerState";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export const CreatePlaceholderTestModal = ({
  isModalOpen,
  setModalOpen,
}: {
  isModalOpen: boolean;
  setModalOpen: (value: boolean) => void;
}) => {
  const [name, setName] = useState<string>("");
  const [min, setMin] = useState<number>(0);
  const [max, setMax] = useState<number>(0);
  const [unit, setUnit] = useState("");

  const { addNewElems } = useDisplayedSequenceState();

  const handleCreate = async () => {
    if (name === "") {
      toast.error("Please enter a test name");
    }
    const res = await addNewElems(
      [createNewTest(
        name,
        "",
        "placeholder",
        false,
        undefined,
        undefined,
        min,
        max,
        unit
      )]
    );
    console.log(res);
    if (res.isErr()) {
      return;
    }
    setModalOpen(false);
  }

  return (
    <Dialog open={isModalOpen} onOpenChange={setModalOpen}>
      <DialogContent>
        <h2 className="text-lg font-bold text-accent1">Create a placeholder test step</h2>
        <p className="text-muted-foreground text-xs"> This will create a new test step with the given name and expected value without being link to any code. The code can be added later.</p>

        <div className="grow pb-1 text-xs">
        <p className="font-bold text-muted-foreground mb-2">
          Test Name
        </p>
        <Input
          placeholder="Power Supply Voltage Test"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        </div>

        <div className="grow pb-1 text-xs">
        <p className="font-bold text-muted-foreground mb-2">
          Expected Value
        </p>
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
        </div>
        <Button onClick={() => handleCreate()}>Create</Button>
      </DialogContent>
    </Dialog>
  );
};
