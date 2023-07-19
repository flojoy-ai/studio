import FamilyHistoryIconSvg from "@src/assets/FamilyHistoryIconSVG";
import { ChangeEvent, memo } from "react";
import { Modal, createStyles, Button, Input } from "@mantine/core";
import { Notifications, notifications } from "@mantine/notifications";
import { useFlowChartState } from "@src/hooks/useFlowChartState";
import { sendApiKeyToDjango } from "@src/services/FlowChartServices";

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
  const { classes } = useStyles();

  const handleApiKeyChange = (e: ChangeEvent<HTMLInputElement>) => {
    setApiKey(e.target.value);
  };

  const handleApiValueChange = (e: ChangeEvent<HTMLInputElement>) => {
    setApiValue(e.target.value);
  };

  const handleClose = () => {
    setApiKey("");
    onClose();
  };

  const handleSendAPI = () => {
    notifications.show({
      id: "set-api-key",
      loading: true,
      title: `Setting your ${apiKey} key`,
      message: `Setting your ${apiKey} key, please be patient`,
      autoClose: false,
      withCloseButton: false,
    });
    sendApiKeyToDjango({ key: apiKey }, "set-cloud-api");
    setApiKey("");
  };

  return (
    <div
      className="relative z-10"
      aria-labelledby="modal-title"
      role="dialog"
      aria-modal="true"
    >
      <div className="fixed inset-0 bg-gray-900 bg-opacity-75 transition-opacity"></div>
      <div className="fixed inset-0 z-10 w-full overflow-y-auto">
        <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
          <div className="relative transform overflow-hidden rounded-lg text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-2xl">
            <div className="bg-modal px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
              <div className="sm:flex sm:items-start">
                <div className="my-5 text-center sm:ml-5 sm:mt-0 sm:text-left">
                  <h3
                    className="mb-4 flex text-base font-semibold leading-6 text-gray-300"
                    id="modal-title"
                  >
                    Environment Variable
                  </h3>
                  <div className="inline-block">
                    <span className="text-accent1 sm:text-sm">Key:</span>
                    <input 
                    className="mt-1 px-3 py-2 border-slate-900 shadow-sm placeholder-slate-400 focus:outline-none focus:border-sky-300 focus:ring-sky-300 block w-60 rounded-md sm:text-sm focus:ring-1" 
                    type="text" 
                    name="APIKey" 
                    placeholder="e.g. CLIENT_KEY" />
                  </div>
                  <div className="ml-8 inline-block">
                    <span className="text-accent1 sm:text-sm">Value:</span>
                    <input 
                    className="mt-1 px-3 py-2 border-slate-900 shadow-sm placeholder-slate-400 focus:outline-none focus:border-sky-300 focus:ring-sky-300 block w-80 rounded-md sm:text-sm focus:ring-1" 
                    type="text" 
                    name="APIValue" 
                    />
                  </div>
                </div>
              </div>

              <button
                type="button"
                className="ml-5 mr-2 inline-flex rounded-md bg-teal-400 px-3 py-2 text-sm font-semibold text-white shadow-sm"
              >
                List of Keys
              </button>
              <button
                type="button"
                className="ml-56 inline-flex rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
              >
                Submit
              </button>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default memo(APIKeyModal);
