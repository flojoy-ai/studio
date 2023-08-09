import FamilyHistoryIconSvg from "@src/assets/FamilyHistoryIconSVG";
import {
  memo,
  ChangeEvent,
  ClipboardEvent,
  useState,
  useEffect,
  useCallback,
} from "react";
import {
  EnvVarCredentialType,
  useFlowChartState,
} from "@src/hooks/useFlowChartState";
import { postEnvironmentVariable } from "@src/services/FlowChartServices";
import EnvVarCredentialsInfo from "./EnvVarCredentials/EnvVarCredentialsInfo";
import { Button } from "@src/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Toaster } from "sonner";
import { ScrollArea } from "@src/components/ui/scroll-area";
import { API_URI } from "@src/data/constants";
import EnvVarDelete from "./EnvVarCredentials/EnvVarDelete";
import EnvVarEdit from "./EnvVarCredentials/EnvVarEdit";

interface EnvVarModalProps {
  handleEnvVarModalOpen: (open: boolean) => void;
  isEnvVarModalOpen: boolean;
}

const EnvVarModal = ({
  handleEnvVarModalOpen,
  isEnvVarModalOpen,
}: EnvVarModalProps) => {
  const { credentials, setCredentials } = useFlowChartState();
  const [envVarKey, setEnvVarKey] = useState<string>("");
  const [envVarValue, setEnvVarValue] = useState<string>("");
  const [selectedCredential, setSelectedCredential] = useState<
    EnvVarCredentialType | undefined
  >(undefined);
  const [editModalOpen, setEditModalOpen] = useState<boolean>(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState<boolean>(false);

  const fetchCredentials = useCallback(() => {
    fetch(`${API_URI}/env/`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((res) => res.json())
      .then((data) => setCredentials(data))
      .catch((err) => console.log(err));
  }, [setCredentials]);

  const handleEnvVarKeyChange = (e: ChangeEvent<HTMLInputElement>) => {
    setEnvVarKey(e.target.value);
  };

  const handleEnvVarValueChange = (e: ChangeEvent<HTMLInputElement>) => {
    setEnvVarValue(e.target.value);
  };

  useEffect(() => {
    if (isEnvVarModalOpen) {
      fetchCredentials();
    }
  }, [isEnvVarModalOpen, fetchCredentials]);

  const handlePaste = (
    e: ClipboardEvent<HTMLInputElement>,
    target: "key" | "value"
  ) => {
    e.preventDefault();
    const val = e.clipboardData.getData("text");
    if (val.includes("=")) {
      const parts = val.split("=");
      setEnvVarKey(parts[0]);
      setEnvVarValue(parts[1]);
    } else {
      if (target === "key") {
        setEnvVarKey(val);
      } else {
        setEnvVarValue(val);
      }
    }
  };

  const handleSendEnvVar = () => {
    postEnvironmentVariable({ key: envVarKey, value: envVarValue });
    setEnvVarKey("");
    setEnvVarValue("");
    fetchCredentials();
  };

  return (
    <Dialog open={isEnvVarModalOpen} onOpenChange={handleEnvVarModalOpen}>
      <DialogContent className="sm:max-w-[650px]">
        <DialogHeader>
          <DialogTitle
            className="ml-2 flex gap-2 text-xl font-semibold text-black dark:text-white"
            id="modal-title"
          >
            <FamilyHistoryIconSvg size={20} />
            <div className="-mt-0.5">Environment Variables</div>
          </DialogTitle>
        </DialogHeader>
        <div className="flex gap-4 py-1 sm:flex-row">
          <div className="inline-block flex-1">
            <Label
              htmlFor="EnvVarKey"
              className="text-right font-semibold text-black dark:text-white sm:text-sm"
            >
              Key:
            </Label>
            <Input
              data-testid="env-var-key-input"
              id="EnvVarKey"
              type="text"
              placeholder="e.g CLIENT_KEY"
              value={envVarKey || ""}
              className=" mt-1 shadow-sm dark:bg-neutral-800 sm:text-sm"
              onPaste={(e) => handlePaste(e, "key")}
              onChange={handleEnvVarKeyChange}
            />
          </div>
          <div className="inline-block flex-1">
            <Label
              htmlFor="EnvVarValue"
              className="text-right font-semibold text-black dark:text-white sm:text-sm"
            >
              Value:
            </Label>
            <Input
              data-testid="env-var-value-input"
              id="EnvVarValue"
              type="password"
              value={envVarValue || ""}
              className="mt-1 text-black shadow-sm dark:bg-neutral-800 dark:text-white sm:text-sm"
              onPaste={(e) => handlePaste(e, "value")}
              onChange={handleEnvVarValueChange}
            />
          </div>
        </div>
        <DialogFooter className="px-3">
          <Button data-testid="env-modal-add-btn" onClick={handleSendEnvVar}>
            Add
          </Button>
        </DialogFooter>
        <hr />
        <div className="max-h-80 ">
          <ScrollArea className="h-80 w-full rounded-md pr-3 last:border-b-0">
            {credentials.map((credential) => (
              <div className="ml-0.5 border-b-[1px] border-b-gray-800 last:border-b-0 odd:bg-gray-900/40">
                <EnvVarCredentialsInfo
                  key={credential.id}
                  credential={credential}
                  setSelectedCredential={setSelectedCredential}
                  setEditModalOpen={setEditModalOpen}
                  setDeleteModalOpen={setDeleteModalOpen}
                />
              </div>
            ))}
          </ScrollArea>
        </div>
        <Toaster className="absolute bottom-0 right-0" />
        {selectedCredential && (
          <>
            <EnvVarDelete
              credential={selectedCredential}
              open={deleteModalOpen}
              setOpen={setDeleteModalOpen}
            />
            <EnvVarEdit
              open={editModalOpen}
              setOpen={setEditModalOpen}
              credentialKey={selectedCredential.key}
              fetchCredentials={fetchCredentials}
            />
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default memo(EnvVarModal);
