import { useSettings } from "@src/hooks/useSettings";
import { SettingsModalProps } from "./SettingsModal";
import { SettingsModal } from "./SettingsModal";

export const DeviceSettingsModal = (props: SettingsModalProps) => {
  const { settings, updateSettings } = useSettings("device");

  return (
    <SettingsModal
      {...props}
      settings={settings}
      updateSettings={updateSettings}
      title="Device Settings"
      description="Applies when discovering devices."
    />
  );
};
