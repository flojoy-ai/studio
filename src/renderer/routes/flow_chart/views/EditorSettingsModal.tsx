import { useSettings } from "@/renderer/hooks/useSettings";
import { SettingsModal } from "./SettingsModal";
import { useAppStore } from "@/renderer/stores/app";
import { useShallow } from "zustand/react/shallow";

export const EditorSettingsModal = () => {
  const { settings, updateSettings } = useSettings("frontend");
  const { isSettingsModalOpen, handleSettingsModalOpen } = useAppStore(
    useShallow((state) => ({
      isSettingsModalOpen: state.isEditorSettingsOpen,
      handleSettingsModalOpen: state.setIsEditorSettingsOpen,
    })),
  );

  return (
    <SettingsModal
      isSettingsModalOpen={isSettingsModalOpen}
      handleSettingsModalOpen={handleSettingsModalOpen}
      settings={settings}
      updateSettings={updateSettings}
      title="Editor Settings"
      description="Applies to the Flojoy editor"
    />
  );
};
