import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@src/components/ui/dialog";
import { Input } from "@src/components/ui/input";
import { Label } from "@src/components/ui/label";
import { editEnvironmentVariable } from "@src/services/FlowChartServices";
import { ChangeEvent, useState } from "react";

export interface EnvVarCredentialsModifyInfoProps {
  credentialKey: string;
}

const EnvVarEdit = ({ credentialKey }: EnvVarCredentialsModifyInfoProps) => {
  const [modifyEnv, setmodifyEnv] = useState<string>("");

  const handleEnvVarValueChange = (e: ChangeEvent<HTMLInputElement>) => {
    setmodifyEnv(e.target.value);
  };

  const handleModify = () => {
    editEnvironmentVariable({ key: credentialKey, value: modifyEnv });
    setmodifyEnv("");
  };

  return (
    <Dialog>
      <DialogTrigger asChild className="h-full w-full border-0">
        <Button variant="outline">Edit</Button>
      </DialogTrigger>
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
            <Label htmlFor="name" className="text-right">
              New Value:
            </Label>
            <Input
              id="modifyEnv"
              placeholder="New Value"
              className="col-span-3"
              value={modifyEnv}
              onChange={handleEnvVarValueChange}
            />
          </div>
        </div>
        <DialogFooter>
          <Button type="submit" onClick={handleModify}>
            Save changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default EnvVarEdit;
