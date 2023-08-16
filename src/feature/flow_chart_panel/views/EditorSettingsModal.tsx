import { useSettings } from "@src/hooks/useSettings";
import { SettingsModalProps } from "./SettingsModal";
import { SettingsModal } from "./SettingsModal";

export const EditorSettingsModal = (props: SettingsModalProps) => {
  const { settings, updateSettings } = useSettings("frontend");

  return (
    <SettingsModal
      {...props}
      settings={settings}
      updateSettings={updateSettings}
      title="Editor Settings"
      description="Applies to the Flojoy editor"
    />
  );
};
