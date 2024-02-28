import { useSettings } from "@/renderer/hooks/useSettings";
import { SettingsModal } from "./SettingsModal";
import { useAppStore } from "@/renderer/stores/app";
import { useShallow } from "zustand/react/shallow";

export const BlockSettingsModal = () => {
  const { settings, updateSettings } = useSettings("backend");

  const { isSettingsModalOpen, handleSettingsModalOpen } = useAppStore(
    useShallow((state) => ({
      isSettingsModalOpen: state.isDeviceSettingsOpen,
      handleSettingsModalOpen: state.setIsDeviceSettingsOpen,
    })),
  );

  return (
    <SettingsModal
      isSettingsModalOpen={isSettingsModalOpen}
      handleSettingsModalOpen={handleSettingsModalOpen}
      settings={settings}
      updateSettings={updateSettings}
      title="Runtime Settings"
      description="Applies when the flowchart is running."
    />
  );
};
