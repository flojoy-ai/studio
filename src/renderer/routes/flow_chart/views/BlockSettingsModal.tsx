import { SettingsModal } from "./SettingsModal";
import { useSettingsStore } from "@/renderer/stores/settings";

type Props = {
  isBlockSettingsOpen: boolean;
  setIsBlockSettingsOpen: (val: boolean) => void;
};

export const BlockSettingsModal = ({
  isBlockSettingsOpen,
  setIsBlockSettingsOpen,
}: Props) => {
  const { backendSettings, updateBackendSettings } = useSettingsStore(
    (state) => ({
      backendSettings: state.backend,
      updateBackendSettings: state.updateBackendSettings,
    }),
  );

  return (
    <SettingsModal
      isSettingsModalOpen={isBlockSettingsOpen}
      handleSettingsModalOpen={setIsBlockSettingsOpen}
      settings={backendSettings}
      updateSettings={updateBackendSettings}
      title="Runtime Settings"
      description="Applies when the flowchart is running."
    />
  );
};
