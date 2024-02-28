import { useSettings } from "@/renderer/hooks/useSettings";
import { SettingsModal } from "./SettingsModal";

type Props = {
  isEditorSettingsOpen: boolean;
  setIsEditorSettingsOpen: (val: boolean) => void;
};

export const EditorSettingsModal = ({
  isEditorSettingsOpen,
  setIsEditorSettingsOpen,
}: Props) => {
  const { settings, updateSettings } = useSettings("frontend");

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
