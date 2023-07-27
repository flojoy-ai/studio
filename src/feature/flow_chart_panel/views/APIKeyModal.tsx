import FamilyHistoryIconSvg from "@src/assets/FamilyHistoryIconSVG";
import { ChangeEvent, memo, ClipboardEvent, useRef } from "react";
import { createStyles } from "@mantine/core";
import { notifications } from "@mantine/notifications";
import { useFlowChartState } from "@src/hooks/useFlowChartState";
import { sendApiKeyToFastAPI } from "@src/services/FlowChartServices";
import APICredentialsInfo from "./APICredentials/APICredentialsInfo";
interface APIKeyModelProps {
  isOpen: boolean;
  onClose: () => void;
  fetchCredentials: () => void;
}

const useStyles = createStyles((theme) => ({
  tabs: {
    marginTop: "10%",
    marginLeft: "2%",
  },
  container: {
    display: "relative",
    border: `1px solid ${theme.colors.accent5[0]}`,
    gap: 43,
    height: 230,
    backgroundColor: theme.colors.modal[1],
    borderRadius: 10,
    boxShadow:
      theme.colorScheme === "light"
        ? `0px 4px 8px 2px ${theme.colors.accent5[1]}`
        : "none",
  },

  title: {
    display: "flex",
    gap: 10,
    fontSize: 20,
    fontWeight: "bold",
    fontFamily: "Inter",
    marginTop: "7%",
    marginLeft: "5.6%",
    marginBottom: "-2%",
  },
  titleText: {
    marginTop: -2.3,
  },
  oneSubmitButtonLine: {
    display: "flex",
    marginLeft: "5.6%",
    marginTop: "4%",
    gap: 4,
    color: theme.colors.accent1[0],
  },
  inputDiv: {
    display: "relative",
    marginRight: 15,
  },
  lastLine: {
    display: "flex",
    marginLeft: "5.7%",
    marginTop: "3.5%",
  },
  submitBtn: {
    marginLeft: "56.2%",
    backgroundColor:
      theme.colorScheme === "dark"
        ? theme.colors.accent1[0]
        : theme.colors.accent2[0],
    color: theme.colorScheme === "dark" ? theme.colors.modal[1] : "none",
    "&:hover": {
      backgroundColor:
        theme.colorScheme === "dark"
          ? theme.colors.accent1[3]
          : theme.colors.accent2[2],
    },
  },
  listBtn: {
    backgroundColor:
      theme.colorScheme === "dark"
        ? theme.colors.accent1[0]
        : theme.colors.accent2[0],
    color: theme.colorScheme === "dark" ? theme.colors.modal[1] : "none",
    "&:hover": {
      backgroundColor:
        theme.colorScheme === "dark"
          ? theme.colors.accent1[3]
          : theme.colors.accent2[2],
    },
  },
  closeBtn: {
    position: "absolute",
    color:
      theme.colorScheme === "dark"
        ? theme.colors.title[0]
        : theme.colors.gray[9],
    top: 10,
    right: 15,
  },
  inputBox: {
    input: {
      width: 240,
      backgroundColor: theme.colors.modal[0],
    },
  },
  s3Title: {
    display: "flex",
    gap: 10,
    fontSize: 20,
    fontWeight: "bold",
    fontFamily: "Inter",
    marginTop: "5%",
    marginLeft: "15%",
  },
  s3ContainerCSS: {
    marginLeft: "15%",
    marginTop: -15,
  },
  s3SubmitBtn: {
    backgroundColor:
      theme.colorScheme === "dark"
        ? theme.colors.accent1[0]
        : theme.colors.accent2[0],
    color: theme.colorScheme === "dark" ? theme.colors.modal[1] : "none",
    "&:hover": {
      backgroundColor:
        theme.colorScheme === "dark"
          ? theme.colors.accent1[3]
          : theme.colors.accent2[2],
    },
    marginLeft: 185,
    marginTop: 5,
  },
}));
const APIKeyModal = ({
  isOpen,
  onClose,
  fetchCredentials,
}: APIKeyModelProps) => {
  const { apiKey, setApiKey, apiValue, setApiValue, credentials } =
    useFlowChartState();

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

  const handleClose = () => {
    setApiKey("");
    setApiValue("");
    onClose();
  };

  const handleSendAPI = () => {
    sendApiKeyToFastAPI({ key: apiKey, value: apiValue });
    setApiKey("");
    setApiValue("");
    fetchCredentials();
  };

  const isDisabled = !(apiKey && apiValue);
  const buttonClass = `ml-80 inline-flex rounded-md bg-accent1 px-3 py-2 text-sm font-semibold dark:text-gray-900 shadow-sm ${
    isDisabled ? "opacity-50 cursor-not-allowed" : "hover:bg-accent1-hover"
  }`;

  if (!isOpen) return null;
  return (
    <div
      className="relative z-10"
      aria-labelledby="modal-title"
      role="dialog"
      aria-modal="true"
    >
      <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"></div>
      <div className="fixed inset-0 z-10 overflow-y-auto">
        <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0 ">
          <div className="relative transform overflow-hidden rounded-xl border-2 border-gray-500 text-left shadow-2xl transition-all sm:my-8 sm:h-full sm:w-full sm:max-w-2xl">
            <div
              className="max-h-96 bg-modal px-4 pb-4 pt-5 sm:p-6 sm:pb-4"
              id="defaultModal"
            >
              <div className="sm:flex sm:items-start">
                <button
                  type="button"
                  className="absolute right-5 top-3 text-right"
                  onClick={handleClose}
                >
                  x
                </button>
                <div className="my-5 text-center sm:ml-5 sm:mt-0 sm:text-left">
                  <div className="ml-3 flex">
                    <FamilyHistoryIconSvg size={22} />
                    <h2
                      className="mb-2.5 ml-2 flex text-xl font-semibold text-black dark:text-white"
                      id="modal-title"
                    >
                      Environment Variables
                    </h2>
                  </div>
                  <div className="ml-4 inline-block">
                    <span className="font-semibold text-accent1 sm:text-sm">
                      Key:
                    </span>
                    <input
                      className="focus:border-gray-500focus:outline-none mt-1 block w-60 rounded-md border-2 border-solid border-gray-600 px-3 py-2 placeholder-slate-400 shadow-sm sm:text-sm"
                      type="text"
                      id="APIKey"
                      placeholder="e.g. CLIENT_KEY"
                      value={apiKey || ""}
                      onPaste={splitOnCopy}
                    />
                  </div>
                  <div className="ml-8 inline-block">
                    <span className="font-semibold text-accent1 sm:text-sm">
                      Value:
                    </span>
                    <input
                      className="mt-1 block w-72 rounded-md border-2 border-solid border-gray-600 px-3 py-2 placeholder-slate-400 shadow-sm focus:border-gray-500 focus:outline-none sm:text-sm"
                      type="password"
                      id="APIValue"
                      value={apiValue || ""}
                      onPaste={splitOnCopy}
                    />
                  </div>
                </div>
              </div>
              <div className="flex justify-center">
                <div className=" ml-44">
                  <button
                    type="button"
                    className={buttonClass}
                    onClick={handleSendAPI}
                    style={{ opacity: !(apiKey && apiValue) ? 0.5 : 1 }}
                    disabled={isDisabled}
                  >
                    Submit
                  </button>
                </div>
              </div>
              <hr className="mt-3.5 h-3" />
            </div>
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
          </div>
        </div>
      </div>
    </div>
  );
};

export default memo(APIKeyModal);
