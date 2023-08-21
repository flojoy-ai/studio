import localforage from "localforage";
import { memo, useState } from "react";
import "react-tabs/style/react-tabs.css";
import KeyboardShortcutModal from "./KeyboardShortcutModal";
import { NodeSettingsModal } from "./NodeSettingsModal";
import EnvVarModal from "./EnvVarModal";
// import useKeyboardShortcut from "@src/hooks/useKeyboardShortcut";
import SaveFlowChartBtn from "./SaveFlowChartBtn";
import { DarkModeToggle } from "@src/feature/common/DarkModeToggle";
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
import { SaveAsButton, SaveButton } from "./ControlBar/SaveButtons";
import { LoadButton } from "./ControlBar/LoadButton";
import { ExportResultButton } from "./ControlBar/ExportResultButton";
import FlowControlButtons from "./ControlBar/FlowControlButtons";

localforage.config({
  name: "react-flow",
  storeName: "flows",
});

const ControlBar = () => {
  const [isKeyboardShortcutOpen, setIsKeyboardShortcutOpen] =
    useState<boolean>(false);
  const [isEnvVarModalOpen, setIsEnvVarModalOpen] = useState<boolean>(false);
  const [isNodeSettingsOpen, setIsNodeSettingsOpen] = useState(false);
  const [isEditorSettingsOpen, setIsEditorSettingsOpen] = useState(false);

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

      <FlowControlButtons />

      <div className="flex">
        <Menubar>
          <MenubarMenu>
            <MenubarTrigger id="file-btn" data-testid="dropdown-button">
              File
            </MenubarTrigger>
            <MenubarContent>
              <SaveButton />
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
