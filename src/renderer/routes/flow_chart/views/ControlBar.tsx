import { memo, useEffect, useState } from "react";
import "react-tabs/style/react-tabs.css";
import KeyboardShortcutModal from "./KeyboardShortcutModal";
import { NodeSettingsModal } from "./NodeSettingsModal";
import EnvVarModal from "./EnvVarModal";
import SaveFlowChartBtn from "./SaveFlowChartBtn";
import { DarkModeToggle } from "@src/routes/common/DarkModeToggle";
import {
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarTrigger,
} from "@src/components/ui/menubar";
import { EditorSettingsModal } from "./EditorSettingsModal";
import { SaveAsButton, SaveButton } from "./ControlBar/SaveButtons";
import { LoadButton } from "./ControlBar/LoadButton";
import { ExportResultButton } from "./ControlBar/ExportResultButton";
import FlowControlButtons from "./ControlBar/FlowControlButtons";
import { useTheme } from "@src/providers/themeProvider";
import { IS_CLOUD_DEMO } from "@src/data/constants";
import { DemoWarningTooltip } from "@src/components/ui/demo-warning-tooltip";
import { DebugSettingsModal } from "./DebugSettingsModal";

const ControlBar = () => {
  const [isKeyboardShortcutOpen, setIsKeyboardShortcutOpen] =
    useState<boolean>(false);
  const [isEnvVarModalOpen, setIsEnvVarModalOpen] = useState<boolean>(false);
  const [isNodeSettingsOpen, setIsNodeSettingsOpen] = useState(false);
  const [isDebugSettingsOpen, setIsDebugSettingsOpen] = useState(false);
  const [isEditorSettingsOpen, setIsEditorSettingsOpen] = useState(false);
  const { resolvedTheme } = useTheme();

  const handleUpdateBlocksPack = () => {
    window.api.updateBlocks();
  };
  const handleChangeNodesPath = () => {
    window.api.changeBlocksPath();
  };
  const handleCheckForUpdates = () => {
    window.api.checkForUpdates();
  };

  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const win = window as any;

    if (typeof win.Featurebase !== "function") {
      win.Featurebase = function() {
        // eslint-disable-next-line prefer-rest-params
        (win.Featurebase.q = win.Featurebase.q || []).push(arguments);
      };
    }
    win.Featurebase("initialize_feedback_widget", {
      organization: "flojoy",
      theme: resolvedTheme,
      // dynamic theme currently does not work
      // featurebase team is already working on supporting it
      // so I will just leave this here for now and it will start working
      // right away when they implement it.controlbar
    });
  }, [resolvedTheme]);

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
      <DebugSettingsModal
        handleSettingsModalOpen={setIsDebugSettingsOpen}
        isSettingsModalOpen={isDebugSettingsOpen}
      />

      <FlowControlButtons />

      <div className="flex">
        <Menubar>
          <MenubarMenu>
            <DemoWarningTooltip
              tooltipContent={
                "Download the desktop app to save and load flowcharts!"
              }
            >
              <MenubarTrigger
                id="file-btn"
                data-testid="file-button"
                disabled={IS_CLOUD_DEMO}
                className={IS_CLOUD_DEMO ? "cursor-not-allowed opacity-50" : ""}
              >
                File
              </MenubarTrigger>
            </DemoWarningTooltip>
            <MenubarContent>
              <SaveButton />
              <SaveAsButton />
              <ExportResultButton />
              <SaveFlowChartBtn />
              <LoadButton />
            </MenubarContent>
          </MenubarMenu>

          <MenubarMenu>
            <MenubarTrigger
              disabled={IS_CLOUD_DEMO}
              data-testid="settings-btn"
              className={IS_CLOUD_DEMO ? "cursor-not-allowed opacity-50" : ""}
            >
              Settings
            </MenubarTrigger>
            <MenubarContent>
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
                onClick={() => setIsNodeSettingsOpen(true)}
              >
                Node Settings
              </MenubarItem>
              <MenubarItem
                data-testid="btn-debug-settings"
                onClick={() => setIsDebugSettingsOpen(true)}
              >
                Debug Settings
              </MenubarItem>
              {"api" in window && (
                <>
                  <MenubarItem
                    data-testid="btn-change-blocks-path"
                    onClick={handleChangeNodesPath}
                  >
                    Change blocks resource path
                  </MenubarItem>
                  <MenubarItem
                    data-testid="btn-update-blocks-pack"
                    onClick={handleUpdateBlocksPack}
                  >
                    Update blocks resource pack
                  </MenubarItem>
                  <MenubarItem onClick={handleCheckForUpdates}>
                    Check for Studio updates
                  </MenubarItem>
                </>
              )}
            </MenubarContent>
          </MenubarMenu>
          <MenubarMenu>
            <MenubarTrigger data-featurebase-feedback>Feedback</MenubarTrigger>
            {/* Below is a small hack such that the Feedback btn won't stay highlighted after closing the window */}
            <MenubarContent className="hidden" />
          </MenubarMenu>
        </Menubar>
      </div>

      <DarkModeToggle />
    </div>
  );
};

export default memo(ControlBar);
