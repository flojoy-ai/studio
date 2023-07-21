import FamilyHistoryIconSvg from "@src/assets/FamilyHistoryIconSVG";
import { ChangeEvent, memo } from "react";
import { createStyles } from "@mantine/core";
import { notifications } from "@mantine/notifications";
import { useFlowChartState } from "@src/hooks/useFlowChartState";
import {
  getApiKeyToFastAPI,
  // GetApiKeyFromFastAPI,
  sendApiKeyToFastAPI,
} from "@src/services/FlowChartServices";

interface APIKeyModelProps {
  isOpen: boolean;
  onClose: () => void;
}

const useStyles = createStyles((theme) => ({
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
}));
const APIKeyModal = ({ isOpen, onClose }: APIKeyModelProps) => {
  const { apiKey, setApiKey, apiValue, setApiValue } = useFlowChartState();

  const handleApiKeyChange = (e: ChangeEvent<HTMLInputElement>) => {
    setApiKey(e.target.value);
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
  };

  const handleGetAPI = () => {
    getApiKeyToFastAPI();
  };

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
                      className="mt-1 block w-60 rounded-md border-2 border-solid border-gray-500 px-3 py-2 placeholder-slate-400 shadow-sm focus:outline-none sm:text-sm"
                      type="text"
                      name="APIKey"
                      id="APIValue"
                      placeholder="e.g. CLIENT_KEY"
                      onChange={handleApiKeyChange}
                    />
                  </div>
                  <div className="ml-8 inline-block">
                    <span className="font-semibold text-accent1 sm:text-sm">
                      Value:
                    </span>
                    <input
                      className="mt-1 block w-72 rounded-md border-2 border-solid border-gray-500 px-3 py-2 placeholder-slate-400 shadow-sm focus:border-gray-500 focus:outline-none sm:text-sm"
                      type="text"
                      name="APIValue"
                      id="APIValue"
                      onChange={handleApiValueChange}
                    />
                  </div>
                </div>
              </div>
              <div className="flex justify-center">
                <button
                  type="button"
                  className="ml-2.5 mr-24 inline-flex rounded-md bg-accent1 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-accent1-hover dark:text-gray-900"
                  onClick={handleGetAPI}
                >
                  List of Keys
                </button>
                <button
                  type="button"
                  className="ml-72 inline-flex rounded-md bg-accent1 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-accent1-hover dark:text-gray-900"
                  onClick={handleSendAPI}
                  style={{ opacity: !(apiKey && apiValue) ? 0.5 : 1 }}
                  disabled={!(apiKey && apiValue)}
                >
                  Submit
                </button>
              </div>
              <hr className="mt-3.5 h-3" />
            </div>
            <div className=" -mt-5 max-h-80 overflow-y-auto bg-modal px-4">
              <div className="relative ml-5 overflow-y-scroll">
                <h2 className="mb-2.5 ml-4 flex text-xl font-semibold text-black dark:text-white">
                  Generated Keys
                </h2>
                <div className="ml-0.5 flex">
                  <h2 className="mb-2.5 ml-4 flex text-base font-semibold text-black dark:text-white">
                    Key:
                  </h2>
                  <h2 className="mb-2.5 ml-4 flex text-base font-semibold text-black dark:text-white">
                    Value:
                  </h2>
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
