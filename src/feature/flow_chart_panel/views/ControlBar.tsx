import {
  Box,
  Text,
  clsx,
  createStyles,
  useMantineColorScheme,
  useMantineTheme,
} from "@mantine/core";
import { AppTab } from "@src/Header";
import { IServerStatus } from "@src/context/socket.context";
import DropDown from "@src/feature/common/DropDown";
import { useFlowChartState } from "@src/hooks/useFlowChartState";
import { useSocket } from "@src/hooks/useSocket";
import {
  cancelFlowChartRun,
  saveAndRunFlowChartInServer,
  saveFlowChartToLocalStorage,
} from "@src/services/FlowChartServices";
import CancelIconSvg from "@src/utils/cancel_icon";
import { IconCaretDown } from "@tabler/icons-react";
import localforage from "localforage";
import { Dispatch, memo, useEffect, useState } from "react";
import ReactSwitch from "react-switch";
import "react-tabs/style/react-tabs.css";
import PlayBtn from "../components/play-btn/PlayBtn";
import KeyboardShortcutModal from "./KeyboardShortcutModal";

const useStyles = createStyles((theme) => {
  return {
    controls: {
      display: "flex",
      alignItems: "center",
      padding: "10px",
      gap: "16px",
    },

    button: {
      marginRight: "10px",
      padding: "5px",
      cursor: "pointer",
      borderRadius: 2,
      fontSize: "14px",
      textDecoration: "none",
      background: "transparent",
      color: theme.colors.title[0],
      border: "none",
    },

    addButton: {
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      gap: "4px",
    },

    addButtonPlus: {
      fontSize: "20px",
      color: theme.colors.accent1[0],
    },

    cancelButton: {
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      gap: "5px",
      height: "33px",
      width: "85px",
      cursor: "pointer",
      color: theme.colors.red[7],
      border: `1px solid ${theme.colors.red[3]}`,
      backgroundColor:
        theme.colorScheme === "dark"
          ? theme.colors.dark[4]
          : theme.colors.gray[2],
      transition: "transform ease-in 0.1s",

      "&:hover": {
        backgroundColor: theme.colors.red[8],
        color: theme.white,
      },

      "&:hover > svg > g": {
        fill: theme.white,
      },

      "&:active": {
        transform: "scale(0.8)",
      },
    },

    fileButton: {
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      gap: "8px",
    },

    editContainer: {
      display: "flex",
      alignItems: "center",
      gap: "8px",
      paddingRight: "4px",
    },
  };
});

localforage.config({
  name: "react-flow",
  storeName: "flows",
});

export type ControlsProps = {
  activeTab: AppTab;
  setOpenCtrlModal: Dispatch<React.SetStateAction<boolean>>;
};

const Controls = ({ activeTab, setOpenCtrlModal }: ControlsProps) => {
  const { states } = useSocket();
  const { socketId, setProgramResults, serverStatus } = states!;
  const [isKeyboardShortcutOpen, setIskeyboardShortcutOpen] = useState(false);
  const { colorScheme } = useMantineColorScheme();
  const { classes } = useStyles();

  const {
    isEditMode,
    setIsEditMode,
    rfInstance,
    openFileSelector,
    saveFile,
    saveFileAs,
  } = useFlowChartState();
  const onSave = async () => {
    if (rfInstance && rfInstance.nodes.length > 0) {
      saveFlowChartToLocalStorage(rfInstance);
      setProgramResults({ io: [] });
      saveAndRunFlowChartInServer({ rfInstance, jobId: socketId });
    } else {
      alert(
        "There is no program to send to server. \n Please add at least one node first."
      );
    }
  };

  const cancelFC = () => {
    if (rfInstance && rfInstance.nodes.length > 0) {
      cancelFlowChartRun({ rfInstance, jobId: socketId });
    } else {
      alert("There is no running job on server.");
    }
  };

  useEffect(() => {
    saveFlowChartToLocalStorage(rfInstance);
  }, [rfInstance]);

  const playBtnDisabled =
    serverStatus === IServerStatus.CONNECTING ||
    serverStatus === IServerStatus.OFFLINE;

  const saveAsDisabled = !("showSaveFilePicker" in window);

  return (
    <Box className={classes.controls}>
      {playBtnDisabled || serverStatus === IServerStatus.STANDBY ? (
        <PlayBtn onClick={onSave} disabled={playBtnDisabled} />
      ) : (
        <button
          className={classes.cancelButton}
          onClick={cancelFC}
          data-cy="btn-cancel"
          title="Cancel Run"
        >
          <CancelIconSvg fill="white" />
          <Text>Cancel</Text>
        </button>
      )}
      {activeTab !== "debug" && (
        <DropDown dropDownBtn={<FileButton />}>
          <button onClick={openFileSelector}>Load</button>
          <button data-cy="btn-save" onClick={saveFile}>
            Save
          </button>
          <button
            data-cy="btn-saveas"
            style={{
              display: "flex",
              justifyContent: "space-between",
              ...(saveAsDisabled && {
                cursor: "not-allowed",
                opacity: 0.5,
              }),
            }}
            className={saveAsDisabled ? "disabled" : ""}
            disabled={saveAsDisabled}
            aria-label="Save As"
            title={
              saveAsDisabled
                ? "Save As is not supported in this browser, sorry!"
                : ""
            }
            onClick={saveFileAs}
          >
            <Text>Save As</Text>
            <small>Ctrl + s</small>
          </button>
          <button>History</button>
          <button onClick={() => setIskeyboardShortcutOpen(true)}>
            Keyboard Shortcut
          </button>
        </DropDown>
      )}

      <KeyboardShortcutModal
        isOpen={isKeyboardShortcutOpen}
        onClose={() => setIskeyboardShortcutOpen(false)}
      />
    </Box>
  );
};

export default memo(Controls);

const FileButton = () => {
  const theme = useMantineTheme();
  const { classes } = useStyles();
  return (
    <button className={clsx(classes.button, classes.fileButton)}>
      <Text>File</Text>
      <IconCaretDown
        size={14}
        fill={theme.colorScheme === "dark" ? theme.white : theme.black}
      />
    </button>
  );
};
