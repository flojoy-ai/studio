import { SettingsModal } from "./SettingsModal";
import { useSettingsStore } from "@/renderer/stores/settings";

type Props = {
  isEditorSettingsOpen: boolean;
  setIsEditorSettingsOpen: (val: boolean) => void;
};

export const EditorSettingsModal = ({
  isEditorSettingsOpen,
  setIsEditorSettingsOpen,
}: Props) => {
  const { settings, updateSettings } = useSettingsStore((state) => ({
    settings: state.frontend,
    updateSettings: state.updateFrontendSettings,
  }));
  console.log('settings', settings);

  return (
    <SettingsModal
      isSettingsModalOpen={isEditorSettingsOpen}
      handleSettingsModalOpen={setIsEditorSettingsOpen}
      settings={settings}
      updateSettings={updateSettings}
      title="Editor Settings"
      description="Applies to the Flojoy editor"
    />
  );
};
