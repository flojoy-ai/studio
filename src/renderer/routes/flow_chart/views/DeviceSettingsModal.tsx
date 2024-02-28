import { useSettings } from "@/renderer/hooks/useSettings";
import { SettingsModal } from "./SettingsModal";

type Props = {
  isDeviceSettingsOpen: boolean;
  setIsDeviceSettingsOpen: (val: boolean) => void;
};

export const DeviceSettingsModal = ({
  isDeviceSettingsOpen,
  setIsDeviceSettingsOpen,
}: Props) => {
  const { settings, updateSettings } = useSettings("device");

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
