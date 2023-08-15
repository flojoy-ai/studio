import { useSettings } from "@src/hooks/useSettings";
import { SettingsModalProps } from "./SettingsModal";
import { SettingsModal } from "./SettingsModal";

export const NodeSettingsModal = (props: SettingsModalProps) => {
  const { settings, updateSettings } = useSettings("backend");

  return (
    <SettingsModal
      {...props}
      settings={settings}
      updateSettings={updateSettings}
      title="Runtime Settings"
      description="Applies when the flowchart is running."
    />
  );
};
