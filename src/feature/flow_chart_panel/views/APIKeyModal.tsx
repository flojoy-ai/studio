import FamilyHistoryIconSvg from "@src/assets/FamilyHistoryIconSVG";
import { memo, ChangeEvent, ClipboardEvent } from "react";
import { useFlowChartState } from "@src/hooks/useFlowChartState";
import { sendApiKeyToFastAPI } from "@src/services/FlowChartServices";
import APICredentialsInfo from "./APICredentials/APICredentialsInfo";
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

interface APIKeyModelProps {
  handleAPIKeyModalOpen: () => void;
  fetchCredentials: () => void;
}

const APIKeyModal = ({
  handleAPIKeyModalOpen,
  fetchCredentials,
}: APIKeyModelProps) => {
  const { apiKey, setApiKey, apiValue, setApiValue, credentials } =
    useFlowChartState();

  const handleApiKeyChange = (e: ChangeEvent<HTMLInputElement>) => {
    setApiKey(e.target.value);
  };

  const splitOnCopy = (e: ClipboardEvent<HTMLInputElement>) => {
    const val = e.clipboardData.getData("text");
    if (val.includes("=")) {
      const apiKey = val.split("=")[0];
      const apiVal = val.split("=")[1];
      setApiKey(apiKey);
      setApiValue(apiVal);
    }
    e.preventDefault();
  };

  const handleApiValueChange = (e: ChangeEvent<HTMLInputElement>) => {
    setApiValue(e.target.value);
  };

  // const handleClose = () => {
  //   setApiKey("");
  //   setApiValue("");
  //   onClose();
  // };

  const handleSendAPI = () => {
    sendApiKeyToFastAPI({ key: apiKey, value: apiValue });
    setApiKey("");
    setApiValue("");
    fetchCredentials();
  };

  // const isDisabled = !(apiKey && apiValue);
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
          onClick={handleAPIKeyModalOpen}
        >
          <div className="-ml-24 flex gap-2">
            <FamilyHistoryIconSvg size={14} />
            <div className="-mt-0.5">Set API key</div>
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
              htmlFor="APIKey"
              className="text-right font-semibold text-black dark:text-white sm:text-sm"
            >
              Key:
            </Label>
            <Input
              id="APIKey"
              type="text"
              placeholder="e.g CLIENT_KEY"
              value={apiKey || ""}
              className=" mt-1 w-64 text-black shadow-sm dark:bg-neutral-800 dark:text-white sm:text-sm"
              onPaste={splitOnCopy}
              onChange={handleApiKeyChange}
            />
          </div>
          <div className="ml-8 inline-block items-center gap-4">
            <Label
              htmlFor="APIValue"
              className="text-right font-semibold text-black dark:text-white sm:text-sm"
            >
              Value:
            </Label>
            <Input
              id="APIValue"
              type="password"
              value={apiValue || ""}
              className="mt-1 w-72 text-black shadow-sm dark:bg-neutral-800 dark:text-white sm:text-sm "
              onPaste={splitOnCopy}
              onChange={handleApiValueChange}
            />
          </div>
        </div>
        <DialogFooter className="px-3">
          <Button onClick={handleSendAPI}>Submit</Button>
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
                    <APICredentialsInfo
                      key={credential.id}
                      credentialKey={credential.id}
                      credential={credential}
                    />
                  ))}
              </div>
            </ScrollArea>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default memo(APIKeyModal);
