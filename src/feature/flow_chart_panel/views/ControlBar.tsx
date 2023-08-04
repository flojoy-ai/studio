import { createStyles } from "@mantine/core";
import { IServerStatus } from "@src/context/socket.context";
import { useFlowChartGraph } from "@src/hooks/useFlowChartGraph";
import { useFlowChartState } from "@src/hooks/useFlowChartState";
import { useSocket } from "@src/hooks/useSocket";
import {
  cancelFlowChartRun,
  saveAndRunFlowChartInServer,
  saveFlowChartToLocalStorage,
} from "@src/services/FlowChartServices";
import { sendProgramToMix } from "@src/services/MixpanelServices";
import localforage from "localforage";
import { memo, useState } from "react";
import "react-tabs/style/react-tabs.css";
import { Edge, Node, ReactFlowJsonObject } from "reactflow";
import { useFilePicker } from "use-file-picker";
import PlayBtn from "../components/PlayBtn";
import CancelBtn from "../components/CancelBtn";
import { ElementsData } from "flojoy/types";
import KeyboardShortcutModal from "./KeyboardShortcutModal";
import { NodeSettingsModal } from "./NodeSettingsModal";
import { useSettings } from "@src/hooks/useSettings";
import EnvVarModal from "./EnvVarModal";
import useKeyboardShortcut from "@src/hooks/useKeyboardShortcut";
import { useControlsState } from "@src/hooks/useControlsState";
import { NodeResult } from "@src/feature/common/types/ResultsType";
import SaveFlowChartBtn from "./SaveFlowChartBtn";
import { Button } from "@src/components/ui/button";
import { DarkModeToggle } from "@src/feature/common/DarkModeToggle";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import WatchBtn from "../components/WatchBtn";

const useStyles = createStyles((theme) => {
  return {
    controls: {
      display: "flex",
      alignItems: "center",
      padding: "10px",
      gap: "8px",
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

const downloadBlob = (blob: Blob, filename: string) => {
  const url = URL.createObjectURL(blob);

  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

// The following buttons are extracted into components in order to isolate the
// rerenders due to calling useFlowChartGraph.

type SaveButtonProps = {
  saveFile: (nodes: Node<ElementsData>[], edges: Edge[]) => void;
};

const SaveButton = ({ saveFile }: SaveButtonProps) => {
  const { nodes, edges } = useFlowChartGraph();
  useKeyboardShortcut("ctrl", "s", () => saveFile(nodes, edges));
  useKeyboardShortcut("meta", "s", () => saveFile(nodes, edges));

  return (
    <DropdownMenuItem data-cy="btn-save" onClick={() => saveFile(nodes, edges)}>
      Save
    </DropdownMenuItem>
  );
};

type SaveAsButtonProps = {
  saveAsDisabled: boolean;
  saveFile: (nodes: Node<ElementsData>[], edges: Edge[]) => void;
} & SaveButtonProps;

const SaveAsButton = ({ saveAsDisabled, saveFile }: SaveAsButtonProps) => {
  const { nodes, edges } = useFlowChartGraph();

  return (
    <DropdownMenuItem
      data-cy="btn-saveas"
      disabled={saveAsDisabled}
      onClick={() => saveFile(nodes, edges)}
    >
      Save As
    </DropdownMenuItem>
  );
};

const LoadButton = () => {
  const { loadFlowExportObject } = useFlowChartGraph();
  const {
    states: { setProgramResults },
  } = useSocket();

  const [openFileSelector] = useFilePicker({
    readAs: "Text",
    accept: [".txt", ".json"],
    maxFileSize: 50,
    onFilesRejected: ({ errors }) => {
      console.error("Errors when trying to load file: ", errors);
    },
    onFilesSuccessfulySelected: ({ filesContent }) => {
      // Just pick the first file that was selected
      const parsedFileContent = JSON.parse(filesContent[0].content);
      const flow = parsedFileContent.rfInstance;
      loadFlowExportObject(flow);
      setProgramResults([]);
    },
  });

  return (
    <DropdownMenuItem onClick={openFileSelector} id="load-app-btn">
      Load
    </DropdownMenuItem>
  );
};

type ExportResultButtonProps = {
  results: NodeResult[];
  disabled: boolean;
};

const ExportResultButton = ({ results, disabled }: ExportResultButtonProps) => {
  const downloadResult = async () => {
    if (!results.length) return;
    const json = JSON.stringify(results, null, 2);
    const blob = new Blob([json], { type: "text/plain;charset=utf-8" });
    if ("showSaveFilePicker" in window) {
      const handle = await window.showSaveFilePicker({
        suggestedName: "output.txt",
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
    } else {
      downloadBlob(blob, "output.txt");
    }
  };

  return (
    <DropdownMenuItem
      onClick={downloadResult}
      className={disabled ? "disabled" : ""}
      disabled={disabled}
    >
      Export Result
    </DropdownMenuItem>
  );
};

const ControlBar = () => {
  const { states } = useSocket();
  const { socketId, programResults, setProgramResults, serverStatus } = states;
  const [isKeyboardShortcutOpen, setIsKeyboardShortcutOpen] =
    useState<boolean>(false);
  const [isEnvVarModalOpen, setIsEnvVarModalOpen] = useState<boolean>(false);
  const { classes } = useStyles();
  const { settingsList } = useSettings();
  const [isNodeSettingsOpen, setIsNodeSettingsOpen] = useState(false);

  const { rfInstance, setRfInstance, setNodeParamChanged } =
    useFlowChartState();
  const { ctrlsManifest } = useControlsState();

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
      downloadBlob(blob, "app.txt");
      sendProgramToMix(rfInstance.nodes);
    }
  };

  const saveFileAs = async (nodes: Node<ElementsData>[], edges: Edge[]) => {
    if (globalThis.IS_ELECTRON) {
      saveFile(nodes, edges);
      return;
    }

    if (rfInstance) {
      const blob = createFileBlob(rfInstance, nodes, edges);

      const handle = await window.showSaveFilePicker({
        suggestedName: "app.txt",
        types: [
          {
            description: "Text file",
            accept: { "text/plain": [".txt"] },
          },
        ],
      });
      const writableStream = await handle.createWritable();

      await writableStream
        .write(blob)
        .then(() => sendProgramToMix(rfInstance.nodes));
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
      sendProgramToMix(rfInstance.nodes, true, false);
      setProgramResults([]);
      saveAndRunFlowChartInServer({
        rfInstance: updatedRfInstance,
        jobId: socketId,
        settings: settingsList.filter((setting) => setting.group === "backend"),
      });
      setNodeParamChanged(false);
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
  const exportResultDisabled = programResults.length == 0;

  return (
    <div className={classes.controls}>
      <EnvVarModal
        handleEnvVarModalOpen={setIsEnvVarModalOpen}
        isEnvVarModalOpen={isEnvVarModalOpen}
      />
      <KeyboardShortcutModal
        handleKeyboardShortcutModalOpen={setIsKeyboardShortcutOpen}
        isKeyboardShortcutModalOpen={isKeyboardShortcutOpen}
      />
      <NodeSettingsModal
        handleNodeSettingsModalOpen={setIsNodeSettingsOpen}
        isNodeSettingsModalOpen={isNodeSettingsOpen}
      />

      <WatchBtn playFC={onRun} cancelFC={cancelFC} />

      {playBtnDisabled || serverStatus === IServerStatus.STANDBY ? (
        <PlayBtn onPlay={onRun} />
      ) : (
        <CancelBtn cancelFC={cancelFC} />
      )}

      <DropdownMenu>
        <DropdownMenuTrigger data-testid="dropdown-button">
          <Button variant="outline" size="sm">
            File
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <SaveAsButton saveFile={saveFileAs} saveAsDisabled={saveAsDisabled} />
          <SaveButton saveFile={saveFile} />
          <ExportResultButton
            results={programResults}
            disabled={exportResultDisabled}
          />
          <SaveFlowChartBtn />
          <LoadButton />
        </DropdownMenuContent>
      </DropdownMenu>

      {/* <Button */}
      {/*   data-testid="btn-setting" */}
      {/*   onClick={() => setIsSettingsOpen(true)} */}
      {/*   size="sm" */}
      {/*   variant="outline" */}
      {/* > */}
      {/*   Settings */}
      {/* </Button> */}

      <DropdownMenu>
        <DropdownMenuTrigger>
          <Button variant="outline" size="sm">
            Settings
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem onClick={() => setIsEnvVarModalOpen(true)}>
            Environment Variables
          </DropdownMenuItem>
          <DropdownMenuItem
            data-testid="btn-keyboardshortcut"
            onClick={() => setIsKeyboardShortcutOpen(true)}
          >
            Keyboard Shortcut
          </DropdownMenuItem>
          <DropdownMenuItem
            data-testid="btn-node-settings"
            onClick={() => setIsNodeSettingsOpen(true)}
          >
            Node Settings
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <DarkModeToggle />
    </div>
  );
};

export default memo(ControlBar);
