import FamilyHistoryIconSvg from "@src/assets/FamilyHistoryIconSVG";
import { memo, ChangeEvent, ClipboardEvent, useState } from "react";
import { useFlowChartState } from "@src/hooks/useFlowChartState";
import { postEnvironmentVariable } from "@src/services/FlowChartServices";
import EnvVarCredentialsInfo from "./EnvVarCredentials/EnvVarCredentialsInfo";
import { Button } from "@src/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Toaster } from "sonner";
interface EnvVarModalProps {
  handleEnvVarModalOpen: () => void;
  fetchCredentials: () => void;
}

const EnvVarModal = ({
  handleEnvVarModalOpen,
  fetchCredentials,
}: EnvVarModalProps) => {
  const { credentials } = useFlowChartState();
  const [envVarKey, setEnvVarKey] = useState<string>("");
  const [envVarValue, setEnvVarValue] = useState<string>("");

  const handleEnvVarKeyChange = (e: ChangeEvent<HTMLInputElement>) => {
    setEnvVarKey(e.target.value);
  };

  const handleEnvVarValueChange = (e: ChangeEvent<HTMLInputElement>) => {
    setEnvVarValue(e.target.value);
  };

  const splitOnCopy = (e: ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const val = e.clipboardData.getData("text");
    if (val.includes("=")) {
      const envVarKey = val.split("=")[0];
      const envVarVal = val.split("=")[1];
      setEnvVarKey(envVarKey);
      setEnvVarValue(envVarVal);
    }
  };

  // const handleClose = () => {
  //   setApiKey("");
  //   setApiValue("");
  //   onClose();
  // };

  const handleSendEnvVar = () => {
    postEnvironmentVariable({ key: envVarKey, value: envVarValue });
    setEnvVarKey("");
    setEnvVarValue("");
    fetchCredentials();
  };

  // const isDisabled = !(envVarKey && envVarValue);
  // const buttonClass = `ml-80 inline-flex rounded-md bg-red px-3 py-2 text-sm font-semibold dark:text-gray-900 shadow-sm ${
  //   isDisabled ? "opacity-50 cursor-not-allowed" : "hover:bg-accent1-hover"
  // }`;

  // if (!isOpen) return null;
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          data-testid="btn-apikey"
          className="flex"
          onClick={handleEnvVarModalOpen}
        >
          <div className="-ml-24 flex gap-2">
            <FamilyHistoryIconSvg size={14} />
            <div className="-mt-0.5">Set Env Var</div>
          </div>
        </Button>
      </DialogTrigger>
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
        <div className="py-1 sm:flex">
          <div className="ml-3 inline-block items-center gap-4">
            <Label
              htmlFor="EnvVarKey"
              className="text-right font-semibold text-black dark:text-white sm:text-sm"
            >
              Key:
            </Label>
            <Input
              id="EnvVarKey"
              type="text"
              placeholder="e.g CLIENT_KEY"
              value={envVarKey || ""}
              className=" mt-1 w-64 text-black shadow-sm dark:bg-neutral-800 dark:text-white sm:text-sm"
              onPaste={splitOnCopy}
              onChange={handleEnvVarKeyChange}
            />
          </div>
          <div className="ml-8 inline-block items-center gap-4">
            <Label
              htmlFor="EnvVarValue"
              className="text-right font-semibold text-black dark:text-white sm:text-sm"
            >
              Value:
            </Label>
            <Input
              id="EnvVarValue"
              type="password"
              value={envVarValue || ""}
              className="mt-1 w-72 text-black shadow-sm dark:bg-neutral-800 dark:text-white sm:text-sm "
              onPaste={splitOnCopy}
              onChange={handleEnvVarValueChange}
            />
          </div>
        </div>
        <DialogFooter className="px-3">
          <Button onClick={handleSendEnvVar}>Add</Button>
        </DialogFooter>
        <hr className="mb-3 mt-1.5 h-3 " />
        <div className="-mt-5 max-h-80 ">
          <div className="relative ml-5">
            <h2 className="mb-2.5 flex text-xl font-semibold text-black dark:text-white">
              Generated Keys
            </h2>
            <ScrollArea className="h-[260px] w-[570px] rounded-md border p-4">
              <div className="pr-3">
                {credentials.length > 0 &&
                  credentials.map((credential) => (
                    <EnvVarCredentialsInfo
                      key={credential.id}
                      credential={credential}
                    />
                  ))}
              </div>
            </ScrollArea>
          </div>
        </div>
        <Toaster className="absolute bottom-0 right-0" />
      </DialogContent>
    </Dialog>
  );
};

export default memo(EnvVarModal);
