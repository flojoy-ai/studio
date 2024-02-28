import { memo, useState } from "react";

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/renderer/components/ui/dialog";
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
import FlowControlButtons from "./ControlBar/FlowControlButtons";
import { DebugSettingsModal } from "./DebugSettingsModal";
import DepManagerModal from "./DepManagerModal";
import { DeviceSettingsModal } from "./DeviceSettingsModal";
import { Button } from "@/renderer/components/ui/button";
import ProfileMenu from "./user-profile/ProfileMenu";
import { useAppStore } from "@/renderer/stores/app";
import { useShallow } from "zustand/react/shallow";

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

      {activeTab === "Visual Python Script" && <FlowControlButtons />}

      <div className="flex">
        <Menubar>
          <MenubarMenu>
            <MenubarTrigger id="file-btn" data-testid="file-button">
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
                onClick={() => setIsBlockSettingsOpen(true)}
              >
                Node Settings
              </MenubarItem>
              <MenubarItem
                data-testid="btn-device-settings"
                onClick={() => setIsDeviceSettingsOpen(true)}
              >
                Device Settings
              </MenubarItem>
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

          <Dialog>
            <DialogTrigger>
              <MenubarMenu>
                <MenubarTrigger>Feedback</MenubarTrigger>
              </MenubarMenu>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>We would love to hear what you think!</DialogTitle>
                <DialogDescription>
                  Join our Discord community to leave us a feedback :)
                </DialogDescription>
              </DialogHeader>
              <DialogFooter>
                <DialogClose>
                  <Button type="submit" variant="secondary">
                    Close
                  </Button>
                </DialogClose>
                <DialogClose>
                  <Button type="submit" asChild>
                    <a href="https://discord.gg/7HEBr7yG8c" target="_blank">
                      Join
                    </a>
                  </Button>
                </DialogClose>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </Menubar>
      </div>
      <ProfileMenu />
      <DarkModeToggle />
    </div>
  );
};

export default memo(ControlBar);
