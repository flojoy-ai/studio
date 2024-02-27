import { atom, useAtom } from "jotai";

export const keyboardShortcutModal = atom<boolean>(false);
export const envVarModal = atom<boolean>(false);
export const nodeSettingsModal = atom<boolean>(false);
export const debugSettingsModal = atom<boolean>(false);
export const editorSettingsModal = atom<boolean>(false);
export const deviceSettingsModal = atom<boolean>(false);
export const depManagerModal = atom<boolean>(false);

export function useToggleSettingModal() {
  const [isKeyboardShortcutOpen, setIsKeyboardShortcutOpen] = useAtom(
    keyboardShortcutModal,
  );
  const [isEnvVarModalOpen, setIsEnvVarModalOpen] = useAtom(envVarModal);
  const [isNodeSettingsOpen, setIsNodeSettingsOpen] =
    useAtom(nodeSettingsModal);
  const [isDebugSettingsOpen, setIsDebugSettingsOpen] =
    useAtom(debugSettingsModal);
  const [isEditorSettingsOpen, setIsEditorSettingsOpen] =
    useAtom(editorSettingsModal);
  const [isDeviceSettingsOpen, setIsDeviceSettingsOpen] =
    useAtom(deviceSettingsModal);
  const [isDepManagerModalOpen, setIsDepManagerModalOpen] =
    useAtom(depManagerModal);
  return {
    isKeyboardShortcutOpen,
    setIsKeyboardShortcutOpen,
    isEnvVarModalOpen,
    setIsEnvVarModalOpen,
    isNodeSettingsOpen,
    setIsNodeSettingsOpen,
    isDebugSettingsOpen,
    setIsDebugSettingsOpen,
    isEditorSettingsOpen,
    setIsEditorSettingsOpen,
    isDeviceSettingsOpen,
    setIsDeviceSettingsOpen,
    isDepManagerModalOpen,
    setIsDepManagerModalOpen,
  };
}
