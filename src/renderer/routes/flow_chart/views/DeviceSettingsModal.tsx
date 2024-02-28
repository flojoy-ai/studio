import { SettingsModal } from "./SettingsModal";
import { useSettingsStore } from "@/renderer/stores/settings";

type Props = {
  isDeviceSettingsOpen: boolean;
  setIsDeviceSettingsOpen: (val: boolean) => void;
};

export const DeviceSettingsModal = ({
  isDeviceSettingsOpen,
  setIsDeviceSettingsOpen,
}: Props) => {
  const { settings, updateSettings } = useSettingsStore((state) => ({
    settings: state.device,
    updateSettings: state.updateDeviceSettings,
  }));

  return (
    <SettingsModal
      isSettingsModalOpen={isDeviceSettingsOpen}
      handleSettingsModalOpen={setIsDeviceSettingsOpen}
      settings={settings}
      updateSettings={updateSettings}
      title="Device Settings"
      description="Applies when discovering devices."
    />
  );
};
