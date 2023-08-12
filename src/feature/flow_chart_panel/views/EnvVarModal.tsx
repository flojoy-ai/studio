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
import { ScrollArea } from "@src/components/ui/scroll-area";
import { API_URI } from "@src/data/constants";
import EnvVarDelete from "./EnvVarCredentials/EnvVarDelete";
import EnvVarEdit from "./EnvVarCredentials/EnvVarEdit";
import { Key } from "lucide-react";
import { toast } from "sonner";
import { Separator } from "@src/components/ui/separator";

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

  const [flojoyCloudKey, setFlojoyCloudKey] = useState<string>("");

  const fetchCredentials = useCallback(() => {
    fetch(`${API_URI}/env/`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((res) => res.json())
      .then((data) => {
        setCredentials(data);
      })
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
    target: "key" | "value",
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

  const handleSendEnvVar = async () => {
    const result = await postEnvironmentVariable({
      key: envVarKey,
      value: envVarValue,
    });

    if (result.ok) {
      toast("Environment variable added");
      setEnvVarKey("");
      setEnvVarValue("");
      fetchCredentials();
    } else {
      toast("Error adding environment variable");
    }
  };

  const handleSetCloudKey = async () => {
    const result = await postEnvironmentVariable({
      key: "FLOJOY_CLOUD_KEY",
      value: flojoyCloudKey,
    });

    if (result.ok) {
      toast(
        "Successfully set your Flojoy Cloud API key, let's stream some data to the cloud!",
      );
      setFlojoyCloudKey("");
      fetchCredentials();
    } else {
      toast("Error adding your Flojoy Cloud API key");
    }
  };

  return (
    <Dialog open={isEnvVarModalOpen} onOpenChange={handleEnvVarModalOpen}>
      <DialogContent className="sm:max-w-[650px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2" id="modal-title">
            <Key size="20" />
            <div className="">Environment Variables</div>
          </DialogTitle>
        </DialogHeader>
        <div className="flex flex-col">
          <div className="text-lg font-bold">Flojoy Cloud Environment</div>
          <div className="py-1" />
          <div className="flex w-full items-center space-x-2">
            <Input
              type="email"
              value={flojoyCloudKey}
              onChange={(e) => setFlojoyCloudKey(e.target.value)}
              className="bg-modal"
              placeholder="Paste your Flojoy Cloud API key here :)"
            />
            <Button type="submit" onClick={handleSetCloudKey}>
              Set
            </Button>
          </div>

          <div className="py-2" />
          <Separator />
          <div className="py-2" />
          <div className="text-lg font-bold">Other Environment</div>
          <div className="py-1" />

          <div className="flex w-full gap-2">
            <div className="flex grow flex-col gap-1">
              <Label
                htmlFor="EnvVarKey"
                className="font-semibold text-foreground"
              >
                Key Name:
              </Label>
              <Input
                data-testid="env-var-key-input"
                id="EnvVarKey"
                type="text"
                placeholder="e.g CLIENT_KEY"
                value={envVarKey || ""}
                className="mt-1 bg-modal"
                onPaste={(e) => handlePaste(e, "key")}
                onChange={handleEnvVarKeyChange}
              />
            </div>
            <div className="flex grow flex-col gap-1">
              <Label
                htmlFor="EnvVarValue"
                className="font-semibold text-foreground"
              >
                Key Value:
              </Label>
              <Input
                data-testid="env-var-value-input"
                id="EnvVarValue"
                value={envVarValue || ""}
                className="mt-1 bg-modal"
                onPaste={(e) => handlePaste(e, "value")}
                onChange={handleEnvVarValueChange}
              />
            </div>
            <div className="flex shrink flex-col">
              <div className="grow" />
              <Button
                data-testid="env-modal-add-btn"
                onClick={handleSendEnvVar}
              >
                Add
              </Button>
            </div>
          </div>
        </div>
        <DialogFooter></DialogFooter>
        <hr />
        <ScrollArea className="h-56 w-full rounded-md last:border-b-0">
          {credentials.map((credential) => (
            <EnvVarCredentialsInfo
              key={credential.key}
              credential={credential}
              setSelectedCredential={setSelectedCredential}
              setEditModalOpen={setEditModalOpen}
              setDeleteModalOpen={setDeleteModalOpen}
            />
          ))}
        </ScrollArea>
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
