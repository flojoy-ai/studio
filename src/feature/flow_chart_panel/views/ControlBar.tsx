import { IServerStatus } from "@src/context/socket.context";
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
import { Edge, Node } from "reactflow";
import PlayBtn from "../components/PlayBtn";
import CancelBtn from "../components/CancelBtn";
import { ElementsData } from "@/types";
import KeyboardShortcutModal from "./KeyboardShortcutModal";
import { NodeSettingsModal } from "./NodeSettingsModal";
import { useSettings } from "@src/hooks/useSettings";
import EnvVarModal from "./EnvVarModal";
// import useKeyboardShortcut from "@src/hooks/useKeyboardShortcut";
import SaveFlowChartBtn from "./SaveFlowChartBtn";
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
import { SaveAsButton } from "./ControlBar/SaveAsButton";
import { LoadButton } from "./ControlBar/LoadButton";
import { ExportResultButton } from "./ControlBar/ExportResultButton";

localforage.config({
  name: "react-flow",
  storeName: "flows",
});

// The following buttons are extracted into components in order to isolate the
// rerenders due to calling useFlowChartGraph.

const ControlBar = () => {
  const { states } = useSocket();
  const { socketId, serverStatus } = states;
  const [isKeyboardShortcutOpen, setIsKeyboardShortcutOpen] =
    useState<boolean>(false);
  const [isEnvVarModalOpen, setIsEnvVarModalOpen] = useState<boolean>(false);
  const { settings } = useSettings("backend");
  const [isNodeSettingsOpen, setIsNodeSettingsOpen] = useState(false);
  const [isEditorSettingsOpen, setIsEditorSettingsOpen] = useState(false);

  const { rfInstance, setRfInstance, setNodeParamChanged } =
    useFlowChartState();

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
            <MenubarTrigger id="file-btn" data-testid="dropdown-button">
              File
            </MenubarTrigger>
            <MenubarContent>
              <SaveAsButton />
              <ExportResultButton />
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
