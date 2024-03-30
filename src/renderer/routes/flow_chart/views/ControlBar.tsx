import { memo, useState } from "react";
import KeyboardShortcutModal from "./KeyboardShortcutModal";
import { BlockSettingsModal } from "./BlockSettingsModal";
import EnvVarModal from "./env-var/EnvVarModal";
import SaveFlowChartBtn from "./SaveFlowChartBtn";
import { DarkModeToggle } from "@/renderer/routes/common/DarkModeToggle";
import {
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarTrigger,
} from "@/renderer/components/ui/menubar";
import { EditorSettingsModal } from "./EditorSettingsModal";
import { SaveAsButton, SaveButton } from "./ControlBar/SaveButtons";
import { LoadButton } from "./ControlBar/LoadButton";
import { ExportResultButton } from "./ControlBar/ExportResultButton";
import { DebugSettingsModal } from "./DebugSettingsModal";
import DepManagerModal from "./DepManagerModal";
import { DeviceSettingsModal } from "./DeviceSettingsModal";
import ProfileMenu from "./user-profile/ProfileMenu";
import { useAppStore } from "@/renderer/stores/app";
import { useShallow } from "zustand/react/shallow";
import FeedbackModal from "./FeedbackModal";
import { SaveSequencesButton } from "@/renderer/routes/test_sequencer_panel/components/control-bar/SaveButton";
import { ImportSequencesButton } from "@/renderer/routes/test_sequencer_panel/components/control-bar/ImportButton";

const ControlBar = () => {
  const { activeTab } = useAppStore(
    useShallow((state) => ({
      activeTab: state.activeTab,
    })),
  );

  const [isKeyboardShortcutOpen, setIsKeyboardShortcutOpen] = useState(false);
  const [isBlockSettingsOpen, setIsBlockSettingsOpen] = useState(false);
  const [isEditorSettingsOpen, setIsEditorSettingsOpen] = useState(false);
  const [isDeviceSettingsOpen, setIsDeviceSettingsOpen] = useState(false);
  const [isDebugSettingsOpen, setIsDebugSettingsOpen] = useState(false);

  const [isFeedbackModalOpen, setIsFeedbackModalOpen] = useState(false);

  const { setIsEnvVarModalOpen, setIsDepManagerModalOpen } = useAppStore(
    useShallow((state) => ({
      setIsEnvVarModalOpen: state.setIsEnvVarModalOpen,
      setIsDepManagerModalOpen: state.setIsDepManagerModalOpen,
    })),
  );

  const handleCheckForUpdates = () => {
    window.api.checkForUpdates();
  };

  return (
    <div className="flex items-center gap-2 p-2.5">
      <EnvVarModal />
      <KeyboardShortcutModal
        isKeyboardShortcutOpen={isKeyboardShortcutOpen}
        setIsKeyboardShortcutOpen={setIsKeyboardShortcutOpen}
      />
      <BlockSettingsModal
        isBlockSettingsOpen={isBlockSettingsOpen}
        setIsBlockSettingsOpen={setIsBlockSettingsOpen}
      />
      <EditorSettingsModal
        isEditorSettingsOpen={isEditorSettingsOpen}
        setIsEditorSettingsOpen={setIsEditorSettingsOpen}
      />
      <DeviceSettingsModal
        isDeviceSettingsOpen={isDeviceSettingsOpen}
        setIsDeviceSettingsOpen={setIsDeviceSettingsOpen}
      />
      <DebugSettingsModal
        isDebugSettingsOpen={isDebugSettingsOpen}
        setIsDebugSettingsOpen={setIsDebugSettingsOpen}
      />
      <DepManagerModal />

      <FeedbackModal
        open={isFeedbackModalOpen}
        setOpen={setIsFeedbackModalOpen}
      />

      <div className="flex">
        <Menubar>
          <MenubarMenu>
            <MenubarTrigger id="file-btn" data-testid="file-button">
              File
            </MenubarTrigger>
            {activeTab === "Test Sequencer" ? (
              <MenubarContent>
                <SaveSequencesButton />
                <ImportSequencesButton />
              </MenubarContent>
            ) : (
              <MenubarContent>
                <SaveButton />
                <SaveAsButton />
                <ExportResultButton />
                <SaveFlowChartBtn />
                <LoadButton />
              </MenubarContent>
            )}
          </MenubarMenu>
          <MenubarMenu>
            <MenubarTrigger data-testid="settings-btn">Settings</MenubarTrigger>
            <MenubarContent>
              <MenubarItem
                data-testid="dep-manager-modal-button"
                onClick={() => setIsDepManagerModalOpen(true)}
              >
                Dependency Manager
              </MenubarItem>
              <MenubarItem
                data-testid="env-var-modal-button"
                onClick={() => setIsEnvVarModalOpen(true)}
              >
                Environment Variables
              </MenubarItem>
              {activeTab !== "Test Sequencer" && (
                <MenubarItem
                  data-testid="btn-keyboardshortcut"
                  onClick={() => setIsKeyboardShortcutOpen(true)}
                >
                  Keyboard Shortcut
                </MenubarItem>
              )}
              {activeTab !== "Test Sequencer" && (
                <MenubarItem
                  data-testid="btn-editor-settings"
                  onClick={() => setIsEditorSettingsOpen(true)}
                >
                  Editor Settings
                </MenubarItem>
              )}
              {activeTab !== "Test Sequencer" && (
                <MenubarItem
                  data-testid="btn-node-settings"
                  onClick={() => setIsBlockSettingsOpen(true)}
                >
                  Block Settings
                </MenubarItem>
              )}
              {activeTab !== "Test Sequencer" && (
                <MenubarItem
                  data-testid="btn-device-settings"
                  onClick={() => setIsDeviceSettingsOpen(true)}
                >
                  Device Settings
                </MenubarItem>
              )}
              <MenubarItem
                data-testid="btn-debug-settings"
                onClick={() => setIsDebugSettingsOpen(true)}
              >
                Debug Settings
              </MenubarItem>

              <MenubarItem onClick={handleCheckForUpdates}>
                Check for Studio updates
              </MenubarItem>

              <MenubarItem onClick={() => window.api.restartCaptain()}>
                Restart Backend
              </MenubarItem>
            </MenubarContent>
          </MenubarMenu>

          <MenubarMenu>
            <MenubarTrigger onClick={() => setIsFeedbackModalOpen(true)}>
              Feedback
            </MenubarTrigger>
          </MenubarMenu>
        </Menubar>
      </div>
      <ProfileMenu />
      <DarkModeToggle />
    </div>
  );
};

export default memo(ControlBar);
