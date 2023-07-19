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
      <div className="fixed inset-0 z-10 overflow-y-auto">
        <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
          <div className="relative transform overflow-hidden rounded-lg text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg">
            <div className="bg-modal px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
              <div className="sm:flex sm:items-start">
                <div className="my-5 text-center sm:ml-4 sm:mt-0 sm:text-left">
                  <h3
                    className="mb-4 flex text-base font-semibold leading-6 text-gray-300"
                    id="modal-title"
                  >
                    Environment Variable
                  </h3>
                  <div className="inline-block">
                    <span className="text-accent1 sm:text-sm">Key:</span>
                    <input
                      className="mt-1 block w-full rounded-md border border-slate-900 py-2 pl-9 pr-3 shadow-sm placeholder:italic placeholder:text-slate-400 focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-500 sm:text-sm"
                      placeholder="e.g. CLIENT_KEY"
                      type="text"
                      name="search"
                    />
                  </div>
                  <div className="ml-4 inline-block">
                    <span className="text-accent1 sm:text-sm">Value:</span>
                    <input
                      className="mt-1 block w-full rounded-md border border-slate-900 py-2 pl-9 pr-3 shadow-sm focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-500 sm:text-sm"
                      type="text"
                      name="search"
                    />
                  </div>
                </div>
              </div>

              <button
                type="button"
                className="inline-flex rounded-md bg-teal-400 px-3 py-2 text-sm font-semibold text-white shadow-sm"
              >
                List of Keys
              </button>
              <button
                type="button"
                className="ml-72 inline-flex w-10 rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
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
