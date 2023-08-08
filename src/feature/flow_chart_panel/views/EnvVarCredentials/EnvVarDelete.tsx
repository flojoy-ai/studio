import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { deleteEnvironmentVariable } from "@src/services/FlowChartServices";
import { useFlowChartState } from "@src/hooks/useFlowChartState";
import { EnvVarCredentialType } from "@src/hooks/useFlowChartState";
import { toast } from "sonner";

export type EnvVarDeleteProps = {
  credential: EnvVarCredentialType;
  open: boolean;
  setOpen: (open: boolean) => void;
};

const EnvVarDelete = ({ credential, open, setOpen }: EnvVarDeleteProps) => {
  const { setCredentials } = useFlowChartState();

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
