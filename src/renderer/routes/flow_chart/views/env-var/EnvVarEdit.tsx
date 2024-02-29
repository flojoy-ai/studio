import { Button } from "@/renderer/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/renderer/components/ui/dialog";
import { Input } from "@/renderer/components/ui/input";
import { Label } from "@/renderer/components/ui/label";
import { postEnvironmentVariable } from "@/renderer/lib/api";
import { useState } from "react";
import { toast } from "sonner";

type Props = {
  credentialKey: string;
  fetchCredentials: () => void;
  open: boolean;
  setOpen: (open: boolean) => void;
};

const EnvVarEdit = ({
  credentialKey,
  fetchCredentials,
  open,
  setOpen,
}: Props) => {
  const [value, setValue] = useState<string>("");

  const handleEdit = async () => {
    const result = await postEnvironmentVariable({
      key: credentialKey,
      value: value,
    });

    if (result.isErr()) {
      toast("Error editing environment variable");
      return;
    }

    toast("Environment variable edited");
    setValue("");
    fetchCredentials();
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-black dark:text-white">
            Edit {credentialKey}
          </DialogTitle>
          <DialogDescription>
            Update {credentialKey} key value
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4 text-black dark:text-white">
            <Label htmlFor="editEnv" className="text-right">
              New Value:
            </Label>
            <Input
              id="editEnv"
              data-tesid="edit-env-input"
              placeholder="New Value"
              className="col-span-3"
              value={value}
              onChange={(e) => setValue(e.target.value)}
            />
          </div>
        </div>
        <DialogFooter>
          <Button
            data-testid="env-var-edit-submit"
            type="submit"
            onClick={handleEdit}
          >
            Save changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default EnvVarEdit;
