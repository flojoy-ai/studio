import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/renderer/components/ui/alert-dialog";
import { deleteEnvironmentVariable } from "@/renderer/lib/api";
import { toast } from "sonner";
import { EnvVar } from "@/renderer/types/env-var";
import { Dispatch, SetStateAction } from "react";

export type EnvVarDeleteProps = {
  credential: EnvVar;
  setCredentials: Dispatch<SetStateAction<EnvVar[]>>;
  open: boolean;
  setOpen: (open: boolean) => void;
};

const EnvVarDelete = ({
  credential,
  setCredentials,
  open,
  setOpen,
}: EnvVarDeleteProps) => {
  const handleDelete = () => {
    setCredentials((prev) => prev.filter((c) => c.key !== credential.key));
    deleteEnvironmentVariable(credential.key);
    toast("Environment variable deleted", { duration: 5000 });
  };

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete your key
            and remove your data from our servers.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel data-testid="env-var-delete-cancel">
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            data-testid="env-var-delete-continue"
            onClick={handleDelete}
          >
            Continue
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default EnvVarDelete;
