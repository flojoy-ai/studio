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
    // <div
    //   className="relative z-10"
    //   aria-labelledby="modal-title"
    //   role="dialog"
    //   aria-modal="true"
    // >
    //   <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"></div>
    //   <div className="fixed inset-0 z-10 overflow-y-auto">
    //     <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0 ">
    //       <div className="relative transform overflow-hidden rounded-xl border-2 border-gray-500 text-left shadow-2xl transition-all sm:my-8 sm:h-full sm:w-full sm:max-w-2xl">
    //         <div
    //           className="max-h-96 bg-modal px-4 pb-4 pt-5 sm:p-6 sm:pb-4"
    //           id="defaultModal"
    //         >
    //           <div className="sm:flex sm:items-start">
    //             <button
    //               type="button"
    //               className="absolute right-5 top-3 text-right"
    //               onClick={handleClose}
    //             >
    //               x
    //             </button>
    //             <div className="my-5 text-center sm:ml-5 sm:mt-0 sm:text-left">
    //               <div className="ml-3 flex">
    //                 <FamilyHistoryIconSvg size={22} />
    //                 <h2
    //                   className="mb-2.5 ml-2 flex text-xl font-semibold text-black dark:text-white"
    //                   id="modal-title"
    //                 >
    //                   Environment Variables
    //                 </h2>
    //               </div>
    //               <div className="ml-4 inline-block">
    //                 <span className="font-semibold text-accent1 sm:text-sm">
    //                   Key:
    //                 </span>
    //                 <input
    //                   className="focus:border-gray-500focus:outline-none mt-1 block w-60 rounded-md border-2 border-solid border-gray-600 px-3 py-2 placeholder-slate-400 shadow-sm sm:text-sm"
    //                   type="text"
    //                   id="APIKey"
    //                   placeholder="e.g. CLIENT_KEY"
    //                   value={apiKey || ""}
    //                   onPaste={splitOnCopy}
    //                   onChange={handleApiKeyChange}
    //                 />
    //               </div>
    //               <div className="ml-8 inline-block">
    //                 <span className="font-semibold text-accent1 sm:text-sm">
    //                   Value:
    //                 </span>
    //                 <input
    //                   className="mt-1 block w-72 rounded-md border-2 border-solid border-gray-600 px-3 py-2 placeholder-slate-400 shadow-sm focus:border-gray-500 focus:outline-none sm:text-sm"
    //                   type="password"
    //                   id="APIValue"
    //                   value={apiValue || ""}
    //                   onPaste={splitOnCopy}
    //                   onChange={handleApiValueChange}
    //                 />
    //               </div>
    //             </div>
    //           </div>
    //           <div className="flex justify-center">
    //             <div className="ml-44">
    //               <Button
    //                 // className={buttonClass}
    //                 onClick={handleSendAPI}
    //                 disabled={isDisabled}
    //               >
    //                 Submit
    //               </Button>
    //             </div>
    //           </div>
    //           <hr className="mt-3.5 h-3" />
    //         </div>
    //         <div className=" -mt-5 max-h-80 overflow-y-auto bg-modal px-4">
    //           <div className="relative ml-6">
    //             <h2 className="mb-2.5 ml-4 flex text-xl font-semibold text-black dark:text-white">
    //               Generated Keys
    //             </h2>
    //             <div className="ml-3.5 pr-6">
    //               {credentials.length > 0 &&
    //                 credentials.map((credential) => (
    //                   <APICredentialsInfo
    //                     key={credential.id}
    //                     credentialKey={credential.id}
    //                     credential={credential}
    //                   />
    //                 ))}
    //             </div>
    //           </div>
    //         </div>
    //       </div>
    //     </div>
    //   </div>
    // </div>
    <Dialog>
      <DialogTrigger asChild>
        <Button
          data-testid="btn-apikey"
          className="flex"
          onClick={handleAPIKeyModalOpen}
        >
          <div className="-ml-24 flex gap-2">
            <FamilyHistoryIconSvg size={14} />
            Set API key
          </div>
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-modal sm:max-w-[700px]">
        <DialogHeader>
          <DialogTitle
            className="mb-2.5 ml-2 flex gap-2 text-xl font-semibold text-black dark:text-white"
            id="modal-title"
          >
            <FamilyHistoryIconSvg size={20} />
            Environment Variables
          </DialogTitle>
        </DialogHeader>
        <div className="gap-4 py-4 sm:flex">
          <div className="ml-4 inline-block items-center gap-4">
            <Label
              htmlFor="APIKey"
              className="text-right font-semibold text-accent1 sm:text-sm"
            >
              Key:
            </Label>
            <Input
              id="APIKey"
              type="text"
              placeholder="e.g CLIENT_KEY"
              value={apiKey || ""}
              className=" mt-1 w-64 text-black shadow-sm sm:text-sm"
              onPaste={splitOnCopy}
              onChange={handleApiKeyChange}
            />
          </div>
          <div className="ml-8 inline-block items-center gap-4">
            <Label
              htmlFor="APIValue"
              className="text-right font-semibold text-accent1 sm:text-sm"
            >
              Value:
            </Label>
            <Input
              id="APIValue"
              type="password"
              value={apiValue || ""}
              className="mt-1 w-72 text-black shadow-sm sm:text-sm"
              onPaste={splitOnCopy}
              onChange={handleApiValueChange}
            />
          </div>
        </div>
        <DialogFooter>
          <Button type="submit" onClick={handleSendAPI}>
            Save changes
          </Button>
        </DialogFooter>
        <hr className="mb-3 mt-1.5 h-3 " />
        <div className=" -mt-5 max-h-80 overflow-y-auto bg-modal px-4">
          <div className="relative ml-6">
            <h2 className="mb-2.5 ml-4 flex text-xl font-semibold text-black dark:text-white">
              Generated Keys
            </h2>
            <div className="ml-3.5 pr-6">
              {credentials.length > 0 &&
                credentials.map((credential) => (
                  <APICredentialsInfo
                    key={credential.id}
                    credentialKey={credential.id}
                    credential={credential}
                  />
                ))}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default memo(APIKeyModal);
