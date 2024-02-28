import { useSettings } from "@/renderer/hooks/useSettings";
import { SettingsModal } from "./SettingsModal";

type Props = {
  isBlockSettingsOpen: boolean;
  setIsBlockSettingsOpen: (val: boolean) => void;
};

export const BlockSettingsModal = ({
  isBlockSettingsOpen,
  setIsBlockSettingsOpen,
}: Props) => {
  const { settings, updateSettings } = useSettings("backend");

  return (
    <SettingsModal
      isSettingsModalOpen={isBlockSettingsOpen}
      handleSettingsModalOpen={setIsBlockSettingsOpen}
      settings={settings}
      updateSettings={updateSettings}
      title="Runtime Settings"
      description="Applies when the flowchart is running."
    />
  );
};
