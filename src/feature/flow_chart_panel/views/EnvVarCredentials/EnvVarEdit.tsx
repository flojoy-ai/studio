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
import { postEnvironmentVariable } from "@src/services/FlowChartServices";
import { ChangeEvent, useState } from "react";

export interface EnvVarCredentialsEditInfoProps {
  credentialKey: string;
  fetchCredentials: () => void;
}

const EnvVarEdit = ({
  credentialKey,
  fetchCredentials,
}: EnvVarCredentialsEditInfoProps) => {
  const [editEnv, setEditEnv] = useState<string>("");

  const handleEnvVarValueChange = (e: ChangeEvent<HTMLInputElement>) => {
    setEditEnv(e.target.value);
  };

  const handleEdit = () => {
    postEnvironmentVariable({ key: credentialKey, value: editEnv });
    setEditEnv("");
    fetchCredentials();
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
            <Label htmlFor="editEnv" className="text-right">
              New Value:
            </Label>
            <Input
              id="editEnv"
              placeholder="New Value"
              className="col-span-3"
              value={editEnv}
              onChange={handleEnvVarValueChange}
            />
          </div>
        </div>
        <DialogFooter>
          <Button type="submit" onClick={handleEdit}>
            Save changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default EnvVarEdit;
