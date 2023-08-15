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
import { ElementsData } from "@/types";
import KeyboardShortcutModal from "./KeyboardShortcutModal";
import { NodeSettingsModal } from "./NodeSettingsModal";
import { useSettings } from "@src/hooks/useSettings";
import EnvVarModal from "./EnvVarModal";
// import useKeyboardShortcut from "@src/hooks/useKeyboardShortcut";
import { useControlsState } from "@src/hooks/useControlsState";
import { NodeResult } from "@src/feature/common/types/ResultsType";
import SaveFlowChartBtn from "./SaveFlowChartBtn";
// import { Button } from "@src/components/ui/button";
import { DarkModeToggle } from "@src/feature/common/DarkModeToggle";
import WatchBtn from "../components/WatchBtn";
import {
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarTrigger,
} from "@src/components/ui/menubar";
import { API_URI } from "@src/data/constants";
import { toast } from "sonner";
import { EditorSettingsModal } from "./EditorSettingsModal";

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
  // useKeyboardShortcut("ctrl", "s", () => saveFile(nodes, edges));
  // useKeyboardShortcut("meta", "s", () => saveFile(nodes, edges));

  return (
    <MenubarItem data-cy="btn-save" onClick={() => saveFile(nodes, edges)}>
      Save
    </MenubarItem>
  );
};

type SaveAsButtonProps = {
  saveAsDisabled: boolean;
  saveFile: (nodes: Node<ElementsData>[], edges: Edge[]) => void;
} & SaveButtonProps;

const SaveAsButton = ({ saveAsDisabled, saveFile }: SaveAsButtonProps) => {
  const { nodes, edges } = useFlowChartGraph();

  return (
    <MenubarItem
      data-cy="btn-saveas"
      disabled={saveAsDisabled}
      onClick={() => saveFile(nodes, edges)}
    >
      Save As
    </MenubarItem>
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
    <MenubarItem onClick={openFileSelector} id="load-app-btn">
      Load
    </MenubarItem>
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
    <MenubarItem
      onClick={downloadResult}
      className={disabled ? "disabled" : ""}
      disabled={disabled}
    >
      Export Result
    </MenubarItem>
  );
};

const ControlBar = () => {
  const { states } = useSocket();
  const { socketId, programResults, serverStatus } = states;
  const [isKeyboardShortcutOpen, setIsKeyboardShortcutOpen] =
    useState<boolean>(false);
  const [isEnvVarModalOpen, setIsEnvVarModalOpen] = useState<boolean>(false);
  const { settings } = useSettings("backend");
  const [isNodeSettingsOpen, setIsNodeSettingsOpen] = useState(false);
  const [isEditorSettingsOpen, setIsEditorSettingsOpen] = useState(false);

  const { rfInstance, setRfInstance, setNodeParamChanged } =
    useFlowChartState();
  const { ctrlsManifest } = useControlsState();

  const createFileBlob = (
    rf: ReactFlowJsonObject<ElementsData>,
    nodes: Node<ElementsData>[],
    edges: Edge[],
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
      // setProgramResults([]);
      saveAndRunFlowChartInServer({
        rfInstance: updatedRfInstance,
        jobId: socketId,
        settings: settings.filter((setting) => setting.group === "backend"),
      });
      setNodeParamChanged(false);
    } else {
      alert(
        "There is no program to send to server. \n Please add at least one node first.",
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

  const handleUpdate = async () => {
    const resp = await fetch(`${API_URI}/update/`, {
      method: "GET",
    });

    const hasUpdate = await resp.json();

    if (hasUpdate) {
      toast("Update available!", {
        action: {
          label: "Update",
          onClick: async () => {
            await fetch(`${API_URI}/update/`, {
              method: "POST",
            });
          },
        },
      });
    } else {
      toast("Your Flojoy Studio is up to date");
    }
  };

  return (
    <div className="flex items-center gap-2 p-2.5">
      <EnvVarModal
        handleEnvVarModalOpen={setIsEnvVarModalOpen}
        isEnvVarModalOpen={isEnvVarModalOpen}
      />

      <KeyboardShortcutModal
        handleKeyboardShortcutModalOpen={setIsKeyboardShortcutOpen}
        isKeyboardShortcutModalOpen={isKeyboardShortcutOpen}
      />

      <NodeSettingsModal
        handleSettingsModalOpen={setIsNodeSettingsOpen}
        isSettingsModalOpen={isNodeSettingsOpen}
      />
      <EditorSettingsModal
        handleSettingsModalOpen={setIsEditorSettingsOpen}
        isSettingsModalOpen={isEditorSettingsOpen}
      />

      {playBtnDisabled || serverStatus === IServerStatus.STANDBY ? (
        <PlayBtn onPlay={onRun} />
      ) : (
        <CancelBtn cancelFC={cancelFC} />
      )}

      <div className="px-0.5" />
      <WatchBtn playFC={onRun} cancelFC={cancelFC} />
      <div className="px-0.5" />

      <div className="flex">
        <Menubar>
          <MenubarMenu>
            <MenubarTrigger data-testid="dropdown-button">File</MenubarTrigger>
            <MenubarContent>
              <SaveAsButton
                saveFile={saveFileAs}
                saveAsDisabled={saveAsDisabled}
              />
              <SaveButton saveFile={saveFile} />
              <ExportResultButton
                results={programResults}
                disabled={exportResultDisabled}
              />
              <SaveFlowChartBtn />
              <LoadButton />
            </MenubarContent>
          </MenubarMenu>

          <MenubarMenu>
            <MenubarTrigger data-testid="dropdown-button">
              Settings
            </MenubarTrigger>
            <MenubarContent>
              <MenubarItem
                data-testid="env-variable-moda-btn"
                onClick={() => setIsEnvVarModalOpen(true)}
              >
                Environment Variables
              </MenubarItem>
              <MenubarItem
                data-testid="btn-keyboardshortcut"
                onClick={() => setIsKeyboardShortcutOpen(true)}
              >
                Keyboard Shortcut
              </MenubarItem>
              <MenubarItem
                data-testid="btn-editor-settings"
                onClick={() => setIsEditorSettingsOpen(true)}
              >
                Editor Settings
              </MenubarItem>
              <MenubarItem
                data-testid="btn-node-settings"
                onClick={() => setIsNodeSettingsOpen(true)}
              >
                Node Settings
              </MenubarItem>
              <MenubarItem
                data-testid="btn-node-settings"
                onClick={handleUpdate}
              >
                Check for update
              </MenubarItem>
            </MenubarContent>
          </MenubarMenu>
        </Menubar>
      </div>

      <DarkModeToggle />
    </div>
  );
};

export default memo(ControlBar);
