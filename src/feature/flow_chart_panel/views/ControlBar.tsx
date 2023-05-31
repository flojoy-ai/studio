import {
  Box,
  Text,
  clsx,
  createStyles,
  useMantineTheme,
  UnstyledButton,
} from "@mantine/core";
import { IServerStatus } from "@src/context/socket.context";
import DropDown from "@src/feature/common/DropDown";
import { useFlowChartGraph } from "@src/hooks/useFlowChartGraph";
import { useFlowChartState } from "@src/hooks/useFlowChartState";
import { useSocket } from "@src/hooks/useSocket";
import {
  cancelFlowChartRun,
  saveAndRunFlowChartInServer,
  saveFlowChartToLocalStorage,
} from "@src/services/FlowChartServices";
import CancelIconSvg from "@src/utils/cancel_icon";
import FamilyHistoryIconSvg from "@src/assets/FamilyHistoryIconSVG";
import HistoryIconSvg from "@src/assets/HistoryIconSVG";
import KeyBoardIconSvg from "@src/assets/KeyboardIconSVG";
import LoadIconSvg from "@src/assets/LoadIconSVG";
import SaveIconSvg from "@src/assets/SaveIconSVG";
import SettingsIconSvg from "@src/assets/SettingsIconSVG";
import { IconCaretDown } from "@tabler/icons-react";
import localforage from "localforage";
import { memo, useEffect, useState, useCallback } from "react";
import "react-tabs/style/react-tabs.css";
import { Edge, Node, ReactFlowJsonObject } from "reactflow";
import { useFilePicker } from "use-file-picker";
import PlayBtn from "../components/play-btn/PlayBtn";
import { ElementsData } from "../types/CustomNodeProps";
import KeyboardShortcutModal from "./KeyboardShortcutModal";
import { SettingsModal } from "./SettingsModal";
import { useSettings } from "@src/hooks/useSettings";
import APIKeyModal from "./APIKeyModal";
import useKeyboardShortcut from "@src/hooks/useKeyboardShortcut";

const useStyles = createStyles((theme) => {
  return {
    controls: {
      display: "flex",
      alignItems: "center",
      padding: "10px",
      gap: "16px",
    },

    button: {
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
    },

    editContainer: {
      display: "flex",
      alignItems: "center",
      gap: "8px",
      paddingRight: "4px",
    },
    dropDownIcon: {
      borderRadius: 20,
    },
    settingsButton: {
      padding: 6,
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      borderRadius: 6,
      "&:hover": {
        backgroundColor: theme.colors.accent1[0] + "2f",
      },
    },
  };
});

localforage.config({
  name: "react-flow",
  storeName: "flows",
});

// The following buttons are extracted into components in order to isolate the
// rerenders due to calling useFlowChartGraph.

type SaveButtonProps = {
  saveFile: (nodes: Node<ElementsData>[], edges: Edge[]) => void;
};

const SaveButton = ({ saveFile }: SaveButtonProps) => {
  const { nodes, edges } = useFlowChartGraph();

  return (
    <button
      data-cy="btn-save"
      onClick={() => saveFile(nodes, edges)}
      style={{ display: "flex", gap: 10.3 }}
    >
      <SaveIconSvg />
      Save
    </button>
  );
};

type SaveAsButtonProps = {
  saveAsDisabled: boolean;
  saveFile: (nodes: Node<ElementsData>[], edges: Edge[]) => void;
} & SaveButtonProps;

const SaveAsButton = ({ saveAsDisabled, saveFile }: SaveAsButtonProps) => {
  const { nodes, edges } = useFlowChartGraph();

  return (
    <button
      data-cy="btn-saveas"
      style={{
        display: "flex",
        gap: 10.9,
      }}
      className={saveAsDisabled ? "disabled" : ""}
      disabled={saveAsDisabled}
      aria-label="Save As"
      title={
        saveAsDisabled ? "Save As is not supported in this browser, sorry!" : ""
      }
      onClick={() => saveFile(nodes, edges)}
    >
      <SaveIconSvg />
      <Text>Save As</Text>
      <div style={{ position: "absolute", marginLeft: 110, marginTop: 1 }}>
        <small>Ctrl + s</small>
      </div>
    </button>
  );
};

const LoadButton = () => {
  const { ctrlsManifest, setCtrlsManifest } = useFlowChartState();
  const { loadFlowExportObject } = useFlowChartGraph();

  const [openFileSelector, { filesContent }] = useFilePicker({
    readAs: "Text",
    accept: ".txt",
    maxFileSize: 50,
  });

  // TODO: Find out why this keeps firing when moving nodes
  useEffect(() => {
    // there will be only single file in the filesContent, for each will loop only once
    filesContent.forEach((file) => {
      const parsedFileContent = JSON.parse(file.content);
      const flow = parsedFileContent.rfInstance;
      setCtrlsManifest(parsedFileContent.ctrlsManifest || ctrlsManifest);
      loadFlowExportObject(flow);
    });
  }, [filesContent, loadFlowExportObject, setCtrlsManifest]);

  return (
    <button onClick={openFileSelector} style={{ display: "flex", gap: 11.77 }}>
      <LoadIconSvg />
      Load
    </button>
  );
};

const ControlBar = () => {
  const { states } = useSocket();
  const { socketId, setProgramResults, serverStatus } = states;
  const [isKeyboardShortcutOpen, setIsKeyboardShortcutOpen] = useState(false);
  const [isAPIKeyModelOpen, setIsAPIKeyModelOpen] = useState<boolean>(false);
  const { classes } = useStyles();
  const { settingsList } = useSettings();
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  const { rfInstance, setRfInstance, ctrlsManifest, setNodeParamChanged } =
    useFlowChartState();

  const createFileBlob = (
    rf: ReactFlowJsonObject<ElementsData>,
    nodes: Node<ElementsData>[],
    edges: Edge[]
  ) => {
    const updatedRf = {
      ...rf,
      nodes,
      edges,
    };

    setRfInstance(updatedRf);

    const fileContent = {
      rfInstance: updatedRf,
      ctrlsManifest,
    };

    const fileContentJsonString = JSON.stringify(fileContent, undefined, 4);

    return new Blob([fileContentJsonString], {
      type: "text/plain;charset=utf-8",
    });
  };

  const saveFile = async (nodes: Node<ElementsData>[], edges: Edge[]) => {
    if (rfInstance) {
      const blob = createFileBlob(rfInstance, nodes, edges);

      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = "flojoy.txt";

      document.body.appendChild(link);
      link.click();

      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    }
  };

  const saveFileAs = async (nodes: Node<ElementsData>[], edges: Edge[]) => {
    if (rfInstance) {
      const blob = createFileBlob(rfInstance, nodes, edges);

      const handle = await window.showSaveFilePicker({
        suggestedName: "flojoy.txt",
        types: [
          {
            description: "Text file",
            accept: { "text/plain": [".txt"] },
          },
        ],
      });
      const writableStream = await handle.createWritable();
      await writableStream.write(blob);
      await writableStream.close();
    }
  };

  const onRun = async (nodes: Node<ElementsData>[], edges: Edge[]) => {
    if (rfInstance && rfInstance.nodes.length > 0) {
      // Only update the react flow instance when required.
      const updatedRfInstance = {
        ...rfInstance,
        nodes,
        edges,
      };
      setRfInstance(updatedRfInstance);

      saveFlowChartToLocalStorage(updatedRfInstance);
      setProgramResults({ io: [] });
      saveAndRunFlowChartInServer({
        rfInstance: updatedRfInstance,
        jobId: socketId,
        settings: settingsList.filter((setting) => setting.group === "backend"),
      });
      setNodeParamChanged(undefined);
    } else {
      alert(
        "There is no program to send to server. \n Please add at least one node first."
      );
    }
  };

  const cancelFC = () => {
    if (rfInstance && rfInstance.nodes.length > 0) {
      cancelFlowChartRun(rfInstance, socketId);
    } else {
      alert("There is no running job on server.");
    }
  };

  const playBtnDisabled =
    serverStatus === IServerStatus.CONNECTING ||
    serverStatus === IServerStatus.OFFLINE;

  const saveAsDisabled = !("showSaveFilePicker" in window);

  const handleKeyboardShortcutModalClose = useCallback(() => {
    setIsKeyboardShortcutOpen(false);
  }, [setIsKeyboardShortcutOpen]);

  const handleAPIKeyModalClose = useCallback(() => {
    setIsAPIKeyModelOpen(false);
  }, [setIsAPIKeyModelOpen]);

  useKeyboardShortcut("ctrl", "c", cancelFC);

  return (
    <Box className={classes.controls}>
      <Box display="flex" mr={24} sx={{ gap: 12 }}>
        {playBtnDisabled || serverStatus === IServerStatus.STANDBY ? (
          <PlayBtn onPlay={onRun} disabled={playBtnDisabled} />
        ) : (
          <button
            className={classes.cancelButton}
            onClick={cancelFC}
            data-cy="btn-cancel"
            title="Cancel Run"
            style={{ borderRadius: 8 }}
          >
            <CancelIconSvg fill="white" />
            <Text>Cancel</Text>
          </button>
        )}
        <DropDown dropDownBtn={<FileButton />}>
          <button
            onClick={() => setIsAPIKeyModelOpen(true)}
            style={{ display: "flex", gap: 7.5 }}
          >
            <FamilyHistoryIconSvg size={14} />
            Set API key
          </button>
          <LoadButton />
          <SaveButton saveFile={saveFile} />
          <SaveAsButton saveFile={saveFileAs} saveAsDisabled={saveAsDisabled} />
          <button style={{ display: "flex", gap: 10.77 }}>
            <HistoryIconSvg />
            History
          </button>
          <button
            onClick={() => setIsKeyboardShortcutOpen(true)}
            style={{ display: "flex", gap: 10.11 }}
          >
            <KeyBoardIconSvg />
            Keyboard Shortcut
          </button>
        </DropDown>

        <UnstyledButton
          onClick={() => setIsSettingsOpen(true)}
          className={classes.settingsButton}
        >
          <SettingsIconSvg />
        </UnstyledButton>
      </Box>

      <KeyboardShortcutModal
        isOpen={isKeyboardShortcutOpen}
        onClose={handleKeyboardShortcutModalClose}
      />

      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
      />
      <APIKeyModal
        isOpen={isAPIKeyModelOpen}
        onClose={handleAPIKeyModalClose}
      />
    </Box>
  );
};

export default memo(ControlBar);

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
